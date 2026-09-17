const categoryController = require("../../../server/controllers/categoryController");
const { requireCurrentUser } = require("../../../lib/auth/require-current-user");
const { jsonResponse, handleRouteError } = require("../../../lib/http/route-helpers");

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const user = await requireCurrentUser(request);
    const result = await categoryController.getCategories(user);
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return handleRouteError(error);
  }
}
