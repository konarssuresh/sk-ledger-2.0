const categoryController = require("../../../../server/controllers/categoryController");
const { requireCurrentUser } = require("../../../../lib/auth/require-current-user");
const {
  parseJsonBody,
  jsonResponse,
  handleRouteError,
} = require("../../../../lib/http/route-helpers");

export const runtime = "nodejs";

export async function PATCH(request, context) {
  try {
    const user = await requireCurrentUser(request);
    const { id } = await context.params;
    const body = await parseJsonBody(request);
    const result = await categoryController.updateCategory(user, id, body);
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request, context) {
  try {
    const user = await requireCurrentUser(request);
    const { id } = await context.params;
    const result = await categoryController.deleteCategory(user, id);
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return handleRouteError(error);
  }
}
