const { ForbiddenError } = require("../errors");

function requireInternalKey(request) {
  const key = request.headers.get("x-internal-key");
  if (!key || key !== process.env.INTERNAL_KEY) {
    throw new ForbiddenError();
  }
}

module.exports = {
  requireInternalKey,
};
