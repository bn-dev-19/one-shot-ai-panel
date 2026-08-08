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
type ZenProxyParams = {
    path: string[];
};
declare function GET(request: Request, context: {
    params: Promise<ZenProxyParams>;
}): Promise<Response>;
declare function POST(request: Request, context: {
    params: Promise<ZenProxyParams>;
}): Promise<Response>;
declare function PUT(request: Request, context: {
    params: Promise<ZenProxyParams>;
}): Promise<Response>;
declare function PATCH(request: Request, context: {
    params: Promise<ZenProxyParams>;
}): Promise<Response>;
declare function DELETE(request: Request, context: {
    params: Promise<ZenProxyParams>;
}): Promise<Response>;
declare function OPTIONS(request: Request, context: {
    params: Promise<ZenProxyParams>;
}): Promise<Response>;

export { DELETE, GET, OPTIONS, PATCH, POST, PUT, type ZenProxyParams };
