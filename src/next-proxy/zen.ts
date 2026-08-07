/**
 * Same-origin proxy for the OpenCode Zen gateway.
 *
 * `one-shot-ai-panel install` copies this file verbatim into
 *   <app>/api/zen/v1/[...path]/route.ts   (Next.js App Router)
 * so the Zen adapter (default baseUrl `/api/zen/v1`) can be called from the
 * browser without CORS failures — opencode.ai does not send CORS headers,
 * so any direct browser call to `https://opencode.ai/zen/v1/*` is blocked.
 *
 * Plain web Request/Response, no Next.js import required.
 * The SDK (openai) still does request construction + SSE parsing client-side;
 * this handler only relays the HTTP traffic server-to-server.
 */

const UPSTREAM = "https://opencode.ai/zen/v1"

const FORWARD_HEADERS = ["authorization", "content-type", "accept"]

type ZenProxyParams = { path: string[] }

async function proxy(
  request: Request,
  params: ZenProxyParams | Promise<ZenProxyParams>,
): Promise<Response> {
  const { path } = await params

  const upstreamUrl = new URL(`${UPSTREAM}/${path.map(encodeURIComponent).join("/")}`)
  const requestUrl = new URL(request.url)
  if (requestUrl.search) upstreamUrl.search = requestUrl.search

  const headers = new Headers()
  for (const name of FORWARD_HEADERS) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }

  const method = request.method.toUpperCase()
  const rawBody = method === "GET" || method === "HEAD" ? null : await request.arrayBuffer()
  const body = rawBody && rawBody.byteLength > 0 ? rawBody : undefined

  const upstream = await fetch(upstreamUrl, {
    method,
    headers,
    body,
  })

  const responseHeaders = new Headers(upstream.headers)
  responseHeaders.delete("content-encoding")
  responseHeaders.delete("content-length")

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  })
}

export async function GET(request: Request, context: { params: Promise<ZenProxyParams> }) {
  return proxy(request, context.params)
}

export async function POST(request: Request, context: { params: Promise<ZenProxyParams> }) {
  return proxy(request, context.params)
}

export async function PUT(request: Request, context: { params: Promise<ZenProxyParams> }) {
  return proxy(request, context.params)
}

export async function PATCH(request: Request, context: { params: Promise<ZenProxyParams> }) {
  return proxy(request, context.params)
}

export async function DELETE(request: Request, context: { params: Promise<ZenProxyParams> }) {
  return proxy(request, context.params)
}

export async function OPTIONS(request: Request, context: { params: Promise<ZenProxyParams> }) {
  return proxy(request, context.params)
}
