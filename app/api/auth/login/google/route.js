const authController = require("../../../../../server/controllers/authController");
const {
  parseJsonBody,
  jsonResponse,
  withSessionCookie,
  handleRouteError,
} = require("../../../../../lib/http/route-helpers");

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await parseJsonBody(request);
    const result = await authController.signinWithGoogle(body);
    const response = jsonResponse(result.body, result.status);
    return withSessionCookie(response, result.token);
  } catch (error) {
    return handleRouteError(error);
  }
}
