const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

function signSessionToken(userId) {
  return jwt.sign({ _id: userId.toString() }, getJwtSecret(), {
    expiresIn: "7d",
  });
}

function verifySessionToken(token) {
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (!payload || !payload._id) {
      throw new UnauthorizedError("Unauthorized: Invalid token");
    }
    return payload;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError("Unauthorized: Invalid token");
  }
}

module.exports = {
  signSessionToken,
  verifySessionToken,
};
