const authController = require("../../../../server/controllers/authController");
const { requireCurrentUser } = require("../../../../lib/auth/require-current-user");
const {
  parseJsonBody,
  jsonResponse,
  handleRouteError,
} = require("../../../../lib/http/route-helpers");

export const runtime = "nodejs";

export async function PATCH(request) {
  try {
    const user = await requireCurrentUser(request);
    const body = await parseJsonBody(request);
    const result = await authController.updateProfile(user, body);
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return handleRouteError(error);
  }
}
