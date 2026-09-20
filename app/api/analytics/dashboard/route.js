const analyticsController = require("../../../../server/controllers/analyticsController");
const { requireCurrentUser } = require("../../../../lib/auth/require-current-user");
const { jsonResponse, handleRouteError } = require("../../../../lib/http/route-helpers");

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const user = await requireCurrentUser(request);
    const { searchParams } = new URL(request.url);
    const query = {
      periodType: searchParams.get("periodType") || undefined,
      date: searchParams.get("date") || undefined,
    };
    const result = await analyticsController.getDashboardAnalytics(user, query);
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return handleRouteError(error);
  }
}
