const LIMIT = 512 * 1024;
const json = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const record = value => value !== null && typeof value === "object" && !Array.isArray(value);

function checkPassword(request, env) {
  if (!env.TABLE_EDIT_PASSWORD) return json({ error: "编辑密码未配置" }, 503);
  let password;
  try { password = decodeURIComponent(request.headers.get("X-Edit-Password") ?? ""); }
  catch { return json({ error: "密码无效" }, 401); }
  if (password !== env.TABLE_EDIT_PASSWORD) return json({ error: "密码无效" }, 401);
  return null;
}

export function editAccess(request, env) {
  if (request.method !== "POST") return json({ error: "不支持的请求方式" }, 405);
  return checkPassword(request, env) ?? json({ ok: true });
}

async function readBody(request) {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > LIMIT + 1024) { await reader.cancel(); return undefined; }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function document(row) {
  return { data: JSON.parse(row.data), revision: row.revision, updatedAt: row.updated_at };
}

export async function documentRequest(request, env, id) {
  if (typeof id !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9:_-]{0,127}$/.test(id)) return json({ error: "记录标识无效" }, 400);
  if (request.method !== "GET" && request.method !== "PUT") return json({ error: "不支持的请求方式" }, 405);
  if (request.method === "PUT") {
    const denied = checkPassword(request, env); if (denied) return denied;
  }
  if (!env.DB) return json({ error: "数据库未配置" }, 503);
  try {
    if (request.method === "GET") {
      const row = await env.DB.prepare("SELECT data, revision, updated_at FROM documents WHERE id = ?").bind(id).first();
      return row ? json(document(row)) : json({ error: "记录不存在" }, 404);
    }
    let body;
    try { body = await readBody(request); } catch { return json({ error: "JSON 无效" }, 400); }
    if (body === undefined) return json({ error: "内容过大" }, 413);
    if (!record(body) || !("data" in body) || !Number.isSafeInteger(body.expectedRevision) || body.expectedRevision < 0) {
      return json({ error: "缺少数据或版本号无效" }, 400);
    }
    const data = JSON.stringify(body.data);
    if (new TextEncoder().encode(data).length > LIMIT) return json({ error: "内容过大" }, 413);
    const now = new Date().toISOString();
    // Atomic compare-and-set; RETURNING gives this write's exact version, not a later writer's.
    const row = body.expectedRevision === 0
      ? await env.DB.prepare("INSERT INTO documents (id, data, revision, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(id) DO NOTHING RETURNING data, revision, updated_at").bind(id, data, now).first()
      : await env.DB.prepare("UPDATE documents SET data = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ? RETURNING data, revision, updated_at").bind(data, now, id, body.expectedRevision).first();
    return row ? json(document(row)) : json({ error: "版本冲突" }, 409);
  } catch { return json({ error: "数据库暂不可用" }, 503); }
}
