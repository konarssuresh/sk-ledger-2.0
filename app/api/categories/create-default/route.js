const categoryController = require("../../../../server/controllers/categoryController");
const { requireInternalKey } = require("../../../../lib/auth/require-internal-key");
const { jsonResponse, handleRouteError } = require("../../../../lib/http/route-helpers");

export const runtime = "nodejs";

export async function POST(request) {
  try {
    requireInternalKey(request);
    const result = await categoryController.createDefaultCategories();
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return handleRouteError(error);
  }
}
