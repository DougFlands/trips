import { createServer as createHttpServer } from "node:http";
import { Readable } from "node:stream";
import { mkdirSync, readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { createServer } from "vite";
import { documentRequest, editAccess } from "../server/documents.js";

// Local SQLite uses the same migration and handlers as D1. No mock saves.
mkdirSync(new URL("../.local/", import.meta.url), { recursive: true });
const database = new DatabaseSync(new URL("../.local/documents.sqlite", import.meta.url));
database.exec(readFileSync(new URL("../migrations/0001_documents.sql", import.meta.url), "utf8"));
const env = {
  TABLE_EDIT_PASSWORD: process.env.TABLE_EDIT_PASSWORD || "trips",
  DB: { prepare: sql => ({ bind: (...params) => ({ first: async () => database.prepare(sql).get(...params) ?? null }) }) },
};
const vite = await createServer({ server: { middlewareMode: true }, appType: "spa" });
const server = createHttpServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (!url.pathname.startsWith("/api/")) return vite.middlewares(req, res);
  try {
    const request = new Request(url, {
      method: req.method, headers: req.headers,
      ...(req.method !== "GET" && req.method !== "HEAD" ? { body: Readable.toWeb(req), duplex: "half" } : {}),
    });
    const match = url.pathname.match(/^\/api\/documents\/([^/]+)$/);
    const response = match ? await documentRequest(request, env, decodeURIComponent(match[1]))
      : url.pathname === "/api/edit-access" ? editAccess(request, env) : new Response(null, { status: 404 });
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch { res.writeHead(500); res.end("Local API error"); }
});
const port = Number(process.env.PORT || 5173);
server.listen(port, "127.0.0.1", () => console.log(`Local tables: http://127.0.0.1:${port}/tools/tables/ (local SQLite)`));
process.on("SIGINT", async () => { server.close(); await vite.close(); database.close(); process.exit(0); });
