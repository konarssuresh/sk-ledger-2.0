const { OAuth2Client } = require("google-auth-library");

function getGoogleClientId() {
  const clientId = process.env.OAUTH_CLIENT || process.env.GOOGLE_CLIENT_ID;
  if (
    clientId &&
    !clientId.endsWith(".apps.googleusercontent.com") &&
    process.env.NODE_ENV !== "test"
  ) {
    console.warn(
      "[google-auth] OAUTH_CLIENT should be the full Web client ID (*.apps.googleusercontent.com).",
    );
  } else if (
    clientId &&
    !/^\d+-/.test(clientId) &&
    process.env.NODE_ENV !== "test"
  ) {
    console.warn(
      "[google-auth] OAUTH_CLIENT is missing the numeric project prefix; use the same ID as NEXT_PUBLIC_GOOGLE_CLIENT_ID.",
    );
  }
  return clientId;
}

function getGoogleClient() {
  const googleClientId = getGoogleClientId();
  if (!googleClientId) {
    return null;
  }
  return new OAuth2Client(googleClientId);
}

async function verifyGoogleCredential(credential) {
  const client = getGoogleClient();
  if (!client) {
    throw new Error("Google client is not configured");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: getGoogleClientId(),
  });

  return ticket.getPayload();
}

module.exports = {
  getGoogleClient,
  verifyGoogleCredential,
};
