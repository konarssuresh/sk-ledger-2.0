const SESSION_COOKIE_NAME = "token";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function getSessionCookieOptions(overrides = {}) {
  const options = {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? "none" : "lax",
    path: "/",
    ...overrides,
  };

  if (isProduction() && process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  return options;
}

function serializeCookie(name, value, options) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
  }
  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`);
  }
  if (options.domain) {
    parts.push(`Domain=${options.domain}`);
  }
  if (options.path) {
    parts.push(`Path=${options.path}`);
  }
  if (options.httpOnly) {
    parts.push("HttpOnly");
  }
  if (options.secure) {
    parts.push("Secure");
  }
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  return parts.join("; ");
}

function buildSetSessionCookieHeader(token) {
  const options = getSessionCookieOptions({
    maxAge: SESSION_MAX_AGE_MS,
    expires: new Date(Date.now() + SESSION_MAX_AGE_MS),
  });
  return serializeCookie(SESSION_COOKIE_NAME, token, options);
}

function buildClearSessionCookieHeader() {
  const options = getSessionCookieOptions({
    maxAge: 0,
    expires: new Date(0),
  });
  return serializeCookie(SESSION_COOKIE_NAME, "", options);
}

module.exports = {
  SESSION_COOKIE_NAME,
  getSessionCookieOptions,
  buildSetSessionCookieHeader,
  buildClearSessionCookieHeader,
};
