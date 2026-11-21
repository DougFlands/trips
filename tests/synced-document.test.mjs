import test from "node:test";
import assert from "node:assert/strict";
import { SyncedDocument, DocumentError, createDocumentTransport, requestDocumentApi } from "../src/lib/synced-document.ts";

test("request timeout has a readable message while caller cancellation is preserved", async t => {
  const timeout = new DOMException("signal timed out", "TimeoutError");
  t.mock.method(globalThis, "fetch", async () => { throw timeout; });
  await assert.rejects(requestDocumentApi("/api/edit-access"), error => error.status === 504 && error.message.includes("连接同步服务超时"));
  const controller = new AbortController(); controller.abort();
  await assert.rejects(requestDocumentApi("/api/edit-access", { signal: controller.signal }), error => error === timeout);
});

test("HTML fallback from a missing API is a readable error, never an empty document", async t => {
  t.mock.method(globalThis, "fetch", async () => new Response("<!doctype html><html></html>", {
    headers: { "Content-Type": "text/html" },
  }));
  const transport = createDocumentTransport(value => typeof value?.note === "string", () => "");
  await assert.rejects(transport.read("notes:test", new AbortController().signal), error =>
    error instanceof DocumentError && error.status === 502 && error.message === "同步服务暂不可用，请稍后重试。");
});

const validate = value => typeof value?.note === "string";
const initialValue = { note: "" }; // Deliberately not a table: the transport/controller are generic.
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};
async function until(predicate) {
  const end = Date.now() + 2000;
  while (!predicate()) {
    if (Date.now() > end) assert.fail("Timed out waiting for document state");
    await new Promise(resolve => setTimeout(resolve, 5));
  }
}
function backend() {
  let remote = null;
  const writes = [];
  return {
    writes, get remote() { return remote; },
    async read() { return structuredClone(remote); },
    async write(_id, data, revision) {
      if (revision !== (remote?.revision ?? 0)) throw new DocumentError("conflict", 409);
      writes.push(structuredClone(data));
      remote = { data: structuredClone(data), revision: revision + 1, updatedAt: new Date().toISOString() };
      return structuredClone(remote);
    },
  };
}
async function client(t, transport, options = {}) {
  const store = new SyncedDocument({ id: "notes:a", initialValue, validate, transport, saveDelay: 20, ...options });
  t.after(() => store.stop());
  store.start(); store.setEditable(true);
  await until(() => store.getSnapshot().ready);
  return store;
}

test("throttles edits, sends the trailing value and supports non-table JSON", async t => {
  const remote = backend(); const store = await client(t, remote);
  store.update({ note: "a" }); store.update({ note: "ab" }); store.update({ note: "abc" });
  await until(() => store.getSnapshot().status === "synced");
  assert.deepEqual(remote.writes, [{ note: "abc" }]);
  store.setEditable(false); store.update({ note: "forbidden" });
  assert.equal(store.getSnapshot().data.note, "abc");
});

test("a slow save cannot overwrite a newer local edit", async t => {
  const remote = backend(); const gate = deferred();
  let first = true;
  const store = await client(t, { read: remote.read, async write(...args) {
    if (first) { first = false; await gate.promise; } return remote.write(...args);
  } });
  store.update({ note: "first" }); await until(() => store.getSnapshot().status === "saving");
  store.update({ note: "latest" }); gate.resolve();
  await until(() => remote.writes.length === 2 && !store.getSnapshot().dirty);
  assert.equal(store.getSnapshot().data.note, "latest");
  assert.equal(remote.remote.data.note, "latest");
});

test("two writers preserve a conflict instead of silently overwriting", async t => {
  const remote = backend(); const a = await client(t, remote); const b = await client(t, remote);
  a.update({ note: "A" }); await until(() => !a.getSnapshot().dirty);
  b.update({ note: "B" }); await until(() => b.getSnapshot().status === "conflict");
  assert.equal(b.getSnapshot().data.note, "B");
  assert.equal(b.getSnapshot().remote.data.note, "A");
  b.resolveConflict("local"); await until(() => b.getSnapshot().status === "synced");
  await a.refresh(); assert.equal(a.getSnapshot().data.note, "B");
});

test("polls do not replace an open editor or a pending local draft", async t => {
  const remote = backend(); const store = await client(t, remote);
  store.setEditing(true);
  await remote.write("notes:a", { note: "remote" }, 0);
  await store.refresh(); assert.equal(store.getSnapshot().data.note, "");
  store.update({ note: "local" }); store.setEditing(false);
  await until(() => store.getSnapshot().status === "conflict");
  assert.equal(store.getSnapshot().data.note, "local");
  store.resolveConflict("remote"); assert.equal(store.getSnapshot().data.note, "remote");
  assert.equal(store.getSnapshot().dirty, false);
});

test("offline edits stay in memory and retry after reconnecting", async t => {
  const remote = backend(); let online = false;
  const store = await client(t, { read: remote.read, async write(...args) {
    if (!online) throw new Error("offline");
    return remote.write(...args);
  } });
  store.update({ note: "keep me" }); await until(() => store.getSnapshot().status === "error");
  assert.equal(store.getSnapshot().data.note, "keep me");
  online = true; await store.refresh();
  await until(() => !store.getSnapshot().dirty);
  assert.equal(remote.remote.data.note, "keep me");
});

test("a new page loads cloud data without restoring unsaved edits", async t => {
  const remote = backend();
  await remote.write("notes:a", { note: "cloud" }, 0);
  const first = await client(t, { read: remote.read, async write() { throw new Error("offline"); } });
  first.update({ note: "unsaved" }); await until(() => first.getSnapshot().status === "error");
  first.stop();
  const next = await client(t, remote);
  assert.equal(next.getSnapshot().data.note, "cloud");
  assert.equal(next.getSnapshot().dirty, false);
  assert.equal(remote.writes.length, 1);
});

test("lost response is reconciled without replaying the successful write", async t => {
  const remote = backend();
  const store = await client(t, { read: remote.read, async write(...args) { await remote.write(...args); throw new Error("lost response"); } });
  store.update({ note: "saved once" }); await until(() => store.getSnapshot().status === "error");
  await store.refresh();
  assert.equal(store.getSnapshot().status, "synced"); assert.equal(remote.writes.length, 1);
});

test("initial read errors never create a blank document", async t => {
  let writes = 0;
  const store = new SyncedDocument({ id: "broken", initialValue, validate, saveDelay: 5,
    transport: { async read() { throw new Error("bad format"); }, async write() { writes++; throw new Error("unexpected"); } } });
  t.after(store.stop); store.start(); store.setEditable(true);
  await until(() => store.getSnapshot().status === "error");
  store.update({ note: "discard" });
  assert.equal(store.getSnapshot().ready, false); assert.equal(writes, 0);
});

test("stopped instances ignore late responses and do not write into another resource", async t => {
  const remote = backend(); const gate = deferred();
  const old = new SyncedDocument({ id: "old", initialValue, validate, transport: { ...remote, read: () => gate.promise } });
  old.start(); old.stop();
  const next = await client(t, remote, { id: "new" });
  gate.resolve({ data: { note: "old" }, revision: 1, updatedAt: new Date().toISOString() });
  await Promise.resolve();
  assert.equal(next.getSnapshot().data.note, ""); assert.equal(old.getSnapshot().ready, false);
});

test("a read started before a successful write cannot roll back its revision", async t => {
  const remote = backend(); const gate = deferred(); let delayed = false;
  const store = await client(t, {
    async read() { if (delayed) return gate.promise; return remote.read(); }, write: remote.write,
  });
  delayed = true;
  const reading = store.refresh();
  store.update({ note: "new version" }); await until(() => !store.getSnapshot().dirty);
  gate.resolve(null); await reading;
  assert.equal(store.getSnapshot().revision, 1);
  assert.equal(store.getSnapshot().data.note, "new version");
  assert.equal(store.getSnapshot().status, "synced");
});
