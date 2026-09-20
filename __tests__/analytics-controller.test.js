jest.mock("../models/Transaction", () => ({
  find: jest.fn(),
}));

jest.mock("../models/Category", () => ({
  find: jest.fn(),
}));

jest.mock("../lib/db", () => jest.fn());

const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const { getDashboardAnalytics } = require("../server/controllers/analyticsController");
const { AppError } = require("../lib/errors");

describe("analyticsController", () => {
  const user = { _id: "u1" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 for invalid period type", async () => {
    await expect(
      getDashboardAnalytics(user, { periodType: "invalid", date: "2026-02-01" }),
    ).rejects.toThrow(AppError);

    await expect(
      getDashboardAnalytics(user, { periodType: "invalid", date: "2026-02-01" }),
    ).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  test("returns 400 for invalid date", async () => {
    await expect(
      getDashboardAnalytics(user, { periodType: "monthly", date: "not-a-date" }),
    ).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  test("returns full analytics payload for monthly period", async () => {
    Transaction.find
      .mockReturnValueOnce({
        sort: () => ({
          lean: async () => [
            {
              _id: "t1",
              name: "Food",
              amount: 200,
              currency: "INR",
              type: "expense",
              note: "",
              date: "2026-02-12T10:00:00.000Z",
              categoryId: "c1",
            },
          ],
        }),
      })
      .mockReturnValueOnce({
        lean: async () => [],
      });

    Category.find.mockReturnValueOnce({
      lean: async () => [{ _id: "c1", name: "Food", emoji: "🍛" }],
    });

    const result = await getDashboardAnalytics(user, {
      periodType: "monthly",
      date: "2026-02-01",
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual(
      expect.objectContaining({
        summary: expect.objectContaining({
          periodType: "monthly",
          expense: 200,
          transactionCount: 1,
        }),
        categorySummary: expect.any(Array),
        trendSummary: expect.any(Array),
        insights: expect.any(Object),
        recentTransactions: expect.any(Array),
      }),
    );
    expect(Transaction.find).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1" }),
    );
  });
});
