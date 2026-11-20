import { documentRequest } from "../../../server/documents.js";

export function onRequest({ request, env, params }) {
  return documentRequest(request, env, params.id);
}
