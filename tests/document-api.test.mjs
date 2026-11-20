import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { documentRequest, editAccess } from "../server/documents.js";
import { onRequest as documentRoute } from "../functions/api/documents/[id].js";

test("Pages route decodes namespaced IDs exactly once and rejects malformed paths", async () => {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../migrations/0001_documents.sql", import.meta.url), "utf8"));
  const env = { TABLE_EDIT_PASSWORD: "test", DB: {
    prepare: sql => ({ bind: (...args) => ({ first: async () => db.prepare(sql).get(...args) ?? null }) }),
  } };
  const route = (id, method = "GET") => documentRoute({ env, params: { id }, request: new Request(`https://local/api/documents/${id}`, {
    method, headers: { "X-Edit-Password": "test" },
    ...(method === "PUT" ? { body: JSON.stringify({ data: { note: "云端" }, expectedRevision: 0 }) } : {}),
  }) });
  try {
    assert.equal((await route("tables%3Anotes", "PUT")).status, 200);
    assert.equal(db.prepare("SELECT id FROM documents").get().id, "tables:notes");
    for (const id of ["tables%3Anotes", "tables:notes"]) {
      assert.equal((await (await route(id)).json()).data.note, "云端");
    }
    for (const id of ["tables%253Anotes", "%", "%E0%A4%A", "tables%2Fnotes"]) {
      const response = await route(id);
      assert.equal(response.status, 400);
      assert.equal(response.headers.get("Cache-Control"), "no-store");
    }
  } finally { db.close(); }
});

test("real SQLite/D1 SQL contract: authorization, create race, versioned updates, validation", async () => {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../migrations/0001_documents.sql", import.meta.url), "utf8"));
  const env = { TABLE_EDIT_PASSWORD: "旅行-test", DB: {
    prepare: sql => ({ bind: (...args) => ({ first: async () => db.prepare(sql).get(...args) ?? null }) }),
  } };
  const request = (method, body, password = "旅行-test") => new Request("http://local/api/documents/test", {
    method, headers: { "X-Edit-Password": encodeURIComponent(password) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  try {
    assert.equal(editAccess(request("POST"), env).status, 200);
    assert.equal(editAccess(request("POST", undefined, "bad"), env).status, 401);
    assert.equal(editAccess(request("POST"), {}).status, 503);
    assert.equal((await documentRequest(request("GET"), env, "test")).status, 404);
    assert.equal((await documentRequest(request("PUT", { data: {}, expectedRevision: 0 }, "bad"), env, "test")).status, 401);
    const create = () => documentRequest(request("PUT", { data: { note: "A" }, expectedRevision: 0 }), env, "test");
    const results = await Promise.all([create(), create()]);
    assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
    const saved = await (await documentRequest(request("GET"), env, "test")).json();
    assert.equal(saved.revision, 1); assert.equal(saved.data.note, "A");
    const update = await documentRequest(request("PUT", { data: ["any", "JSON"], expectedRevision: 1 }), env, "test");
    assert.equal(update.status, 200); assert.equal((await update.json()).revision, 2);
    assert.equal((await documentRequest(request("PUT", { data: {}, expectedRevision: 1 }), env, "test")).status, 409);
    assert.equal((await documentRequest(request("PUT", { data: {}, expectedRevision: -1 }), env, "test")).status, 400);
    assert.equal((await documentRequest(request("PUT", { data: "x".repeat(513 * 1024), expectedRevision: 2 }), env, "test")).status, 413);
    assert.equal((await documentRequest(request("GET"), env, "../bad")).status, 400);
    assert.equal((await documentRequest(request("GET"), {}, "test")).status, 503);
    assert.equal((await documentRequest(request("GET"), env, "test")).headers.get("Cache-Control"), "no-store");
  } finally { db.close(); }
});
