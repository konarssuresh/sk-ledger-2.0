const connectDb = require("../db");
const User = require("../../models/User");
const { verifySessionToken } = require("./jwt");
const { UnauthorizedError } = require("../errors");

function getTokenFromRequest(request) {
  if (!request?.headers) {
    return undefined;
  }
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

async function resolveUserFromToken(token) {
  if (!token) {
    throw new UnauthorizedError("Unauthorized: No token provided");
  }

  const { _id } = verifySessionToken(token);
  await connectDb();

  const user = await User.findById(_id);
  if (!user) {
    throw new UnauthorizedError("Unauthorized: User not found");
  }

  return user;
}

/**
 * Server-only: resolve the authenticated user from the HTTP-only session cookie.
 * Pass the Route Handler `request` when testing outside the Next request context.
 */
async function requireCurrentUser(request) {
  let token;

  if (request?.headers) {
    token = getTokenFromRequest(request);
  } else {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;
  }

  return resolveUserFromToken(token);
}

module.exports = {
  requireCurrentUser,
  resolveUserFromToken,
  getTokenFromRequest,
};
