import { documentRequest } from "../../../server/documents.js";

export function onRequest({ request, env, params }) {
  let id;
  try { id = decodeURIComponent(params.id); }
  catch { return Response.json({ error: "记录标识无效" }, { status: 400, headers: { "Cache-Control": "no-store" } }); }
  return documentRequest(request, env, id);
}
