require("./mongoSetup");

const { invokeRoute } = require("./helpers/route-test");
const {
  createUser,
  authCookieForUser,
  createCategory,
  createTransaction,
} = require("./helpers");
const { GET: dashboardGet } = require("../app/api/analytics/dashboard/route");

async function fetchDashboard(user, periodType, date) {
  return invokeRoute(dashboardGet, {
    method: "GET",
    url: `http://localhost:3000/api/analytics/dashboard?periodType=${periodType}&date=${date}`,
    cookies: authCookieForUser(user),
  });
}

describe("analytics reconciliation", () => {
  test("monthly totals and trend length match February fixtures", async () => {
    const user = await createUser();
    const expenseCat = await createCategory(user, { name: "Food", type: "expense" });
    const incomeCat = await createCategory(user, { name: "Salary", type: "income" });
    const savingsCat = await createCategory(user, { name: "Fund", type: "savings" });

    await createTransaction(user, expenseCat, {
      date: new Date("2026-02-10T12:00:00.000Z"),
      type: "expense",
      amount: 300,
    });
    await createTransaction(user, incomeCat, {
      date: new Date("2026-02-11T09:00:00.000Z"),
      type: "income",
      amount: 1000,
    });
    await createTransaction(user, savingsCat, {
      date: new Date("2026-02-12T14:00:00.000Z"),
      type: "savings",
      amount: 200,
    });

    const res = await fetchDashboard(user, "monthly", "2026-02-01");

    expect(res.status).toBe(200);
    expect(res.body.summary.income).toBe(1000);
    expect(res.body.summary.expense).toBe(300);
    expect(res.body.summary.savings).toBe(200);
    expect(res.body.summary.balance).toBe(500);
    expect(res.body.summary.transactionCount).toBe(3);
    expect(res.body.trendSummary).toHaveLength(28);
    expect(res.body.insights.netFlow).toBe(500);
    expect(res.body.recentTransactions).toHaveLength(3);
  });

  test("daily buckets transactions by UTC hour", async () => {
    const user = await createUser();
    const category = await createCategory(user, { type: "expense" });

    await createTransaction(user, category, {
      date: new Date("2026-03-15T10:30:00.000Z"),
      type: "expense",
      amount: 150,
    });

    const res = await fetchDashboard(user, "daily", "2026-03-15");

    expect(res.status).toBe(200);
    expect(res.body.summary.expense).toBe(150);
    expect(res.body.summary.transactionCount).toBe(1);
    expect(res.body.trendSummary).toHaveLength(24);
    const hourTen = res.body.trendSummary.find((row) => row.label === "10:00");
    expect(hourTen.expense).toBe(150);
  });

  test("weekly range includes Monday-start week fixtures", async () => {
    const user = await createUser();
    const category = await createCategory(user, { type: "expense" });

    await createTransaction(user, category, {
      date: new Date("2026-03-11T08:00:00.000Z"),
      type: "expense",
      amount: 80,
    });

    const res = await fetchDashboard(user, "weekly", "2026-03-15");

    expect(res.status).toBe(200);
    expect(res.body.summary.expense).toBe(80);
    expect(res.body.trendSummary).toHaveLength(7);
  });

  test("yearly aggregates by month", async () => {
    const user = await createUser();
    const category = await createCategory(user, { type: "income" });

    await createTransaction(user, category, {
      date: new Date("2026-06-20T12:00:00.000Z"),
      type: "income",
      amount: 5000,
    });

    const res = await fetchDashboard(user, "yearly", "2026-01-01");

    expect(res.status).toBe(200);
    expect(res.body.summary.income).toBe(5000);
    expect(res.body.trendSummary).toHaveLength(12);
    const june = res.body.trendSummary[5];
    expect(june.income).toBe(5000);
  });

  test("does not include another user's transactions", async () => {
    const owner = await createUser();
    const other = await createUser();
    const category = await createCategory(owner, { type: "expense" });
    await createTransaction(owner, category, {
      date: new Date("2026-02-12T10:00:00.000Z"),
      type: "expense",
      amount: 999,
    });

    const res = await fetchDashboard(other, "monthly", "2026-02-01");

    expect(res.status).toBe(200);
    expect(res.body.summary.expense).toBe(0);
    expect(res.body.summary.transactionCount).toBe(0);
  });
});
