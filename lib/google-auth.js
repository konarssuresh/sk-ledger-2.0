const { OAuth2Client } = require("google-auth-library");

// Netlify: set NEXT_PUBLIC_GOOGLE_CLIENT_ID only (also used server-side). Avoid duplicating the same ID as GOOGLE_CLIENT_ID/OAUTH_CLIENT in Netlify env — secrets scanning flags the client bundle.
function getGoogleClientId() {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.OAUTH_CLIENT ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (
    clientId &&
    !clientId.endsWith(".apps.googleusercontent.com") &&
    process.env.NODE_ENV !== "test"
  ) {
    console.warn(
      "[google-auth] Google client ID should be the full Web client ID (*.apps.googleusercontent.com).",
    );
  } else if (
    clientId &&
    !/^\d+-/.test(clientId) &&
    process.env.NODE_ENV !== "test"
  ) {
    console.warn(
      "[google-auth] Google client ID is missing the numeric project prefix; use the same ID as NEXT_PUBLIC_GOOGLE_CLIENT_ID.",
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
