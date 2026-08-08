// src/next-proxy/zen.ts
var UPSTREAM = "https://opencode.ai/zen/v1";
var FORWARD_HEADERS = ["authorization", "content-type", "accept"];
async function proxy(request, params) {
  const { path } = await params;
  const upstreamUrl = new URL(`${UPSTREAM}/${path.map(encodeURIComponent).join("/")}`);
  const requestUrl = new URL(request.url);
  if (requestUrl.search) upstreamUrl.search = requestUrl.search;
  const headers = new Headers();
  for (const name of FORWARD_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const method = request.method.toUpperCase();
  const rawBody = method === "GET" || method === "HEAD" ? null : await request.arrayBuffer();
  const body = rawBody && rawBody.byteLength > 0 ? rawBody : void 0;
  const upstream = await fetch(upstreamUrl, {
    method,
    headers,
    body
  });
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders
  });
}
async function GET(request, context) {
  return proxy(request, context.params);
}
async function POST(request, context) {
  return proxy(request, context.params);
}
async function PUT(request, context) {
  return proxy(request, context.params);
}
async function PATCH(request, context) {
  return proxy(request, context.params);
}
async function DELETE(request, context) {
  return proxy(request, context.params);
}
async function OPTIONS(request, context) {
  return proxy(request, context.params);
}
export {
  DELETE,
  GET,
  OPTIONS,
  PATCH,
  POST,
  PUT
};
//# sourceMappingURL=zen-proxy.js.map