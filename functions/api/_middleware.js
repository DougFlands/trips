// Only loopback development pages need cross-origin access. Writes still require the password.
function isDevelopmentOrigin(origin) {
  try {
    const url = new URL(origin);
    return url.origin === origin && ["http:", "https:"].includes(url.protocol)
      && ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch { return false; }
}

export async function onRequest({ request, next }) {
  const origin = request.headers.get("Origin");
  if (!origin || origin === new URL(request.url).origin) return next();
  if (!isDevelopmentOrigin(origin)) {
    return Response.json({ error: "不允许此来源访问" }, { status: 403, headers: { "Cache-Control": "no-store", Vary: "Origin" } });
  }
  const headers = {
    "Access-Control-Allow-Origin": origin,
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
  if (request.method === "OPTIONS") {
    const method = request.headers.get("Access-Control-Request-Method");
    const requestedHeaders = (request.headers.get("Access-Control-Request-Headers") ?? "")
      .split(",").map(header => header.trim().toLowerCase()).filter(Boolean);
    if (!["GET", "PUT", "POST"].includes(method)
      || requestedHeaders.some(header => !["content-type", "x-edit-password"].includes(header))) {
      return Response.json({ error: "不支持的跨域请求" }, { status: 403, headers });
    }
    return new Response(null, { status: 204, headers: {
      ...headers, "Access-Control-Allow-Methods": "GET, PUT, POST",
      "Access-Control-Allow-Headers": "Content-Type, X-Edit-Password",
      "Access-Control-Max-Age": "600",
    } });
  }
  const result = await next();
  const response = new Response(result.body, result);
  const vary = response.headers.get("Vary");
  for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
  if (vary) response.headers.set("Vary", `${vary}, Origin`);
  return response;
}
