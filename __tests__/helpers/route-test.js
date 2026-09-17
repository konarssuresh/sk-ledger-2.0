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

async function invokeRoute(handler, { method = "GET", url, body, cookies } = {}) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (cookies) {
    headers.set(
      "cookie",
      Array.isArray(cookies) ? cookies.join("; ") : cookies,
    );
  }

  const init = { method, headers };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const request = new NextRequest(url || "http://localhost:3000/api/test", init);
  const response = await handler(request);
  return readResponse(response);
}

module.exports = {
  invokeRoute,
  readResponse,
};
