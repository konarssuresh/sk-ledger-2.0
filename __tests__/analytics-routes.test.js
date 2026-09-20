require("./mongoSetup");

const { invokeRoute } = require("./helpers/route-test");
const { createUser, authCookieForUser, createCategory, createTransaction } = require("./helpers");
const { GET: dashboardGet } = require("../app/api/analytics/dashboard/route");

describe("analytics Route Handlers", () => {
  test("GET /api/analytics/dashboard returns dashboard payload", async () => {
    const user = await createUser();
    const category = await createCategory(user, { name: "Food", type: "expense" });
    await createTransaction(user, category, {
      date: new Date("2026-02-12T10:00:00.000Z"),
      type: "expense",
      amount: 500,
    });

    const res = await invokeRoute(dashboardGet, {
      method: "GET",
      url: "http://localhost:3000/api/analytics/dashboard?periodType=monthly&date=2026-02-01",
      cookies: authCookieForUser(user),
    });

    expect(res.status).toBe(200);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.expense).toBe(500);
    expect(Array.isArray(res.body.categorySummary)).toBe(true);
    expect(Array.isArray(res.body.trendSummary)).toBe(true);
    expect(res.body.insights).toBeDefined();
    expect(Array.isArray(res.body.recentTransactions)).toBe(true);
  });

  test("GET /api/analytics/dashboard validates periodType", async () => {
    const user = await createUser();
    const res = await invokeRoute(dashboardGet, {
      method: "GET",
      url: "http://localhost:3000/api/analytics/dashboard?periodType=invalid&date=2026-02-01",
      cookies: authCookieForUser(user),
    });

    expect(res.status).toBe(400);
  });

  test("GET /api/analytics/dashboard rejects unauthenticated requests", async () => {
    const res = await invokeRoute(dashboardGet, {
      method: "GET",
      url: "http://localhost:3000/api/analytics/dashboard?periodType=monthly&date=2026-02-01",
    });

    expect(res.status).toBe(401);
  });
});
