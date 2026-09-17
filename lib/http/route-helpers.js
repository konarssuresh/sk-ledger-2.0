const { NextResponse } = require("next/server");
const { toErrorResponse } = require("../errors");
const {
  buildSetSessionCookieHeader,
  buildClearSessionCookieHeader,
} = require("../auth/cookies");

async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new Error("Request body must be a valid JSON object");
  }
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return NextResponse.json(data, { status, headers: extraHeaders });
}

function withSessionCookie(response, token) {
  response.headers.append("Set-Cookie", buildSetSessionCookieHeader(token));
  return response;
}

function withClearSessionCookie(response) {
  response.headers.append("Set-Cookie", buildClearSessionCookieHeader());
  return response;
}

function handleRouteError(error) {
  const { status, body } = toErrorResponse(error);
  return NextResponse.json(body, { status });
}

module.exports = {
  parseJsonBody,
  jsonResponse,
  withSessionCookie,
  withClearSessionCookie,
  handleRouteError,
};
