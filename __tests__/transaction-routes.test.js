require("./mongoSetup");

const { invokeRoute } = require("./helpers/route-test");
const { createUser, authCookieForUser, createCategory, createTransaction } = require("./helpers");
const { POST: createPost } = require("../app/api/transactions/create/route");
const { GET: listGet } = require("../app/api/transactions/route");
const { GET: monthSummaryGet } = require("../app/api/transactions/month-summary/route");
const {
  GET: byIdGet,
  PATCH: patchTx,
  DELETE: deleteTx,
} = require("../app/api/transactions/[id]/route");

describe("transaction Route Handlers", () => {
  test("POST /api/transactions/create creates transaction", async () => {
    const user = await createUser();
    const category = await createCategory(user);
    const res = await invokeRoute(createPost, {
      method: "POST",
      url: "http://localhost:3000/api/transactions/create",
      cookies: authCookieForUser(user),
      body: {
        name: "Lunch",
        amount: 120,
        currency: "INR",
        categoryId: String(category._id),
        date: "2026-02-12",
        type: "expense",
      },
    });

    expect(res.status).toBe(201);
    expect(res.body.transaction.name).toBe("Lunch");
  });

  test("GET /api/transactions fetches all transactions", async () => {
    const user = await createUser();
    const category = await createCategory(user);
    await createTransaction(user, category);

    const res = await invokeRoute(listGet, {
      method: "GET",
      url: "http://localhost:3000/api/transactions",
      cookies: authCookieForUser(user),
    });

    expect(res.status).toBe(200);
    expect(res.body.transactions.length).toBe(1);
  });

  test("GET /api/transactions with date filter returns filtered data", async () => {
    const user = await createUser();
    const category = await createCategory(user);
    await createTransaction(user, category, {
      date: new Date("2026-02-12T10:00:00.000Z"),
    });
    await createTransaction(user, category, {
      date: new Date("2026-02-13T10:00:00.000Z"),
    });

    const res = await invokeRoute(listGet, {
      method: "GET",
      url: "http://localhost:3000/api/transactions?date=2026-02-12",
      cookies: authCookieForUser(user),
    });

    expect(res.status).toBe(200);
    expect(res.body.transactions.length).toBe(1);
  });

  test("GET /api/transactions/:id returns transaction by id", async () => {
    const user = await createUser();
    const category = await createCategory(user);
    const tx = await createTransaction(user, category);

    const res = await invokeRoute(byIdGet, {
      method: "GET",
      url: `http://localhost:3000/api/transactions/${tx._id}`,
      cookies: authCookieForUser(user),
      params: { id: String(tx._id) },
    });

    expect(res.status).toBe(200);
    expect(res.body.transaction._id).toBe(String(tx._id));
  });

  test("PATCH /api/transactions/:id updates transaction", async () => {
    const user = await createUser();
    const category = await createCategory(user);
    const tx = await createTransaction(user, category, { name: "Old" });

    const res = await invokeRoute(patchTx, {
      method: "PATCH",
      url: `http://localhost:3000/api/transactions/${tx._id}`,
      cookies: authCookieForUser(user),
      params: { id: String(tx._id) },
      body: { name: "Updated" },
    });

    expect(res.status).toBe(200);
    expect(res.body.transaction.name).toBe("Updated");
  });

  test("PATCH /api/transactions/:id allows zero amount", async () => {
    const user = await createUser();
    const category = await createCategory(user);
    const tx = await createTransaction(user, category, { amount: 50 });

    const res = await invokeRoute(patchTx, {
      method: "PATCH",
      url: `http://localhost:3000/api/transactions/${tx._id}`,
      cookies: authCookieForUser(user),
      params: { id: String(tx._id) },
      body: { amount: 0 },
    });

    expect(res.status).toBe(200);
    expect(res.body.transaction.amount).toBe(0);
  });

  test("DELETE /api/transactions/:id deletes transaction", async () => {
    const user = await createUser();
    const category = await createCategory(user);
    const tx = await createTransaction(user, category);

    const res = await invokeRoute(deleteTx, {
      method: "DELETE",
      url: `http://localhost:3000/api/transactions/${tx._id}`,
      cookies: authCookieForUser(user),
      params: { id: String(tx._id) },
    });

    expect(res.status).toBe(200);
  });

  test("GET /api/transactions/month-summary returns summary", async () => {
    const user = await createUser();
    const category = await createCategory(user);
    await createTransaction(user, category, {
      date: new Date("2026-02-12T10:00:00.000Z"),
      type: "income",
      amount: 2000,
    });
    await createTransaction(user, category, {
      date: new Date("2026-02-12T12:00:00.000Z"),
      type: "expense",
      amount: 500,
    });

    const res = await invokeRoute(monthSummaryGet, {
      method: "GET",
      url: "http://localhost:3000/api/transactions/month-summary?year=2026&month=2",
      cookies: authCookieForUser(user),
    });

    expect(res.status).toBe(200);
    expect(res.body["2026-02-12"]).toBeDefined();
    expect(res.body["2026-02-12"].income).toBe(2000);
  });
});
