const transactionController = require("../../../server/controllers/transactionController");
const { requireCurrentUser } = require("../../../lib/auth/require-current-user");
const { jsonResponse, handleRouteError } = require("../../../lib/http/route-helpers");

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const user = await requireCurrentUser(request);
    const { searchParams } = new URL(request.url);
    const query = { date: searchParams.get("date") || undefined };
    const result = await transactionController.getTransactions(user, query);
    return jsonResponse(result.body, result.status);
  } catch (error) {
    return handleRouteError(error);
  }
}
