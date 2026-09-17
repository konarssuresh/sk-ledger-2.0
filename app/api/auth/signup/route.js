const authController = require("../../../../server/controllers/authController");
const {
  parseJsonBody,
  jsonResponse,
  handleRouteError,
} = require("../../../../lib/http/route-helpers");

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await parseJsonBody(request);
    const result = await authController.signup(body);
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return handleRouteError(error);
  }
}
