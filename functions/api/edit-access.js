import { editAccess } from "../../server/documents.js";

export function onRequest({ request, env }) {
  return editAccess(request, env);
}
