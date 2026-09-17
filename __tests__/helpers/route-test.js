const { NextRequest } = require("next/server");

async function readResponse(response) {
  const text = await response.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }
  return {
    status: response.status,
    body: json,
    headers: response.headers,
    cookies: response.headers.getSetCookie?.() || [],
  };
}

async function invokeRoute(
  handler,
  { method = "GET", url, body, cookies, headers: extraHeaders, params } = {},
) {
  const headers = new Headers();
  if (method !== "GET" && method !== "DELETE") {
    headers.set("Content-Type", "application/json");
  }
  if (cookies) {
    headers.set(
      "cookie",
      Array.isArray(cookies) ? cookies.join("; ") : cookies,
    );
  }
  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }

  const init = { method, headers };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const request = new NextRequest(url || "http://localhost:3000/api/test", init);
  const context = params ? { params: Promise.resolve(params) } : undefined;
  const response = context
    ? await handler(request, context)
    : await handler(request);
  return readResponse(response);
}

module.exports = {
  invokeRoute,
  readResponse,
};
