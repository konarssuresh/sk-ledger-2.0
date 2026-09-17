const authController = require("../../../../server/controllers/authController");
const {
  jsonResponse,
  withClearSessionCookie,
} = require("../../../../lib/http/route-helpers");

export const runtime = "nodejs";

export async function POST() {
  const result = await authController.signout();
  const response = jsonResponse(result.body, result.status);
  return withClearSessionCookie(response);
}
