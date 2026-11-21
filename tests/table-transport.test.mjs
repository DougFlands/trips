import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { createServer } from "vite";
import { documentRequest } from "../server/documents.js";

test("table transport migrates only on edit, round trips typed values and rejects stale writes", async t => {
  // Vite resolves the application's extensionless TS imports without a second test loader.
  const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom",
    cacheDir: "node_modules/.vite-table-tests", optimizeDeps: { noDiscovery: true, include: [] } });
  const db = new DatabaseSync(":memory:");
  try {
    const { createTableTransport } = await vite.ssrLoadModule("/src/lib/table-transport.ts");
    db.exec(readFileSync(new URL("../migrations/0001_documents.sql", import.meta.url), "utf8"));
    const env = { TABLE_EDIT_PASSWORD: "test", DB: {
      prepare: sql => ({ bind: (...args) => ({ first: async () => db.prepare(sql).get(...args) ?? null }) }),
    } };
    const legacy = { schemaVersion: 1, columns: [{ id: "notes", name: "备注" }], rows: [{ id: "a", cells: { notes: "第一行\n第二行" } }] };
    const seed = await documentRequest(new Request("https://test/api/documents/table", {
      method: "PUT", headers: { "X-Edit-Password": "test" }, body: JSON.stringify({ data: legacy, expectedRevision: 0 }),
    }), env, "tables:transport-test");
    assert.equal(seed.status, 200);
    const requests = [];
    t.mock.method(globalThis, "fetch", async (path, init) => {
      assert.ok(path.startsWith("https://trip.flands.com/api/documents/"), "development requests go directly to production");
      requests.push(init?.method ?? "GET");
      return documentRequest(new Request(new URL(path, "https://test"), init), env, decodeURIComponent(path.split("/").pop()));
    });
    const transport = createTableTransport(() => "test"), signal = new AbortController().signal;
    const first = await transport.read("tables:transport-test", signal);
    const second = await transport.read("tables:transport-test", signal);
    assert.equal(first.data.schemaVersion, 2);
    assert.equal(first.data.columns[0].type, "multiline");
    assert.deepEqual(first.data.rows, legacy.rows);
    assert.equal(first.revision, 1);
    assert.deepEqual(requests, ["GET", "GET"]);
    assert.equal(JSON.parse(db.prepare("SELECT data FROM documents").get().data).schemaVersion, 1);
    const changed = { ...first.data, columns: [...first.data.columns,
      { id: "amount", name: "金额", type: "currency" }, { id: "done", name: "勾选", type: "checkbox" },
      { id: "date", name: "日期", type: "date" }, { id: "tags", name: "标签", type: "multiselect", options: ["已订"] },
    ], rows: [{ id: "a", cells: { ...first.data.rows[0].cells, amount: 0, done: false, date: "2028-02-29", tags: ["已订"] } }] };
    const saved = await transport.write("tables:transport-test", changed, first.revision, signal);
    assert.equal(saved.revision, 2);
    assert.deepEqual((await transport.read("tables:transport-test", signal)).data, changed);
    await assert.rejects(transport.write("tables:transport-test", second.data, second.revision, signal), error => error.status === 409);
    const locked = createTableTransport(() => "wrong");
    await assert.rejects(locked.write("tables:transport-test", changed, 2, signal), error => error.status === 401);
    assert.equal((await transport.read("tables:transport-test", signal)).revision, 2);
  } finally { db.close(); await vite.close(); }
});
