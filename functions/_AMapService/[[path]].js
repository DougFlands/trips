const ALLOWED_METHODS = new Set(["GET", "HEAD"]);

export async function onRequest(context) {
  if (!ALLOWED_METHODS.has(context.request.method)) {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }

  const securityJsCode = context.env.AMAP_SECURITY_JS_CODE;
  if (!securityJsCode) {
    return new Response("AMap proxy is not configured", { status: 503 });
  }

  const requestUrl = new URL(context.request.url);
  const upstreamPath = requestUrl.pathname.replace(/^\/_AMapService/, "") || "/";
  const upstreamHost = upstreamPath.startsWith("/v4/map/styles")
    ? "webapi.amap.com"
    : "restapi.amap.com";
  const upstreamUrl = new URL(`https://${upstreamHost}${upstreamPath}`);
  upstreamUrl.search = requestUrl.search;
  upstreamUrl.searchParams.set("jscode", securityJsCode);

  const response = await fetch(upstreamUrl, {
    method: context.request.method,
    headers: { Accept: context.request.headers.get("Accept") ?? "*/*" },
  });
  const headers = new Headers(response.headers);
  headers.delete("set-cookie");
  headers.set("cache-control", "public, max-age=300");

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
