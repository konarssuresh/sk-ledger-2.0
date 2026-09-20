const {
  dayTransactionsKey,
  monthSummaryKey,
  keysForTransactionDate,
} = require("../features/transactions/api");

describe("transaction cache keys", () => {
  it("builds month summary key", () => {
    expect(monthSummaryKey(2026, 3)).toEqual([
      "transactions",
      "month",
      2026,
      3,
    ]);
  });

  it("builds day transactions key", () => {
    expect(dayTransactionsKey("2026-03-15")).toEqual([
      "transactions",
      "day",
      "2026-03-15",
    ]);
  });

  it("keysForTransactionDate maps ISO date to month and day keys", () => {
    const { month, day } = keysForTransactionDate("2026-03-15T10:00:00.000Z");
    expect(month).toEqual(monthSummaryKey(2026, 3));
    expect(day).toEqual(dayTransactionsKey("2026-03-15"));
  });

  it("keysForTransactionDate returns null keys for invalid input", () => {
    expect(keysForTransactionDate(null)).toEqual({ month: null, day: null });
    expect(keysForTransactionDate("")).toEqual({ month: null, day: null });
    expect(keysForTransactionDate("not-a-date")).toEqual({
      month: null,
      day: null,
    });
  });
});
