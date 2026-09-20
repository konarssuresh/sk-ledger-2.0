const { dashboardAnalyticsKey } = require("../features/dashboard/api");

describe("analytics cache keys", () => {
  it("builds dashboard key from period type and date", () => {
    expect(dashboardAnalyticsKey("monthly", "2026-02-01")).toEqual([
      "analytics",
      "dashboard",
      "monthly",
      "2026-02-01",
    ]);
  });

  it("preserves daily weekly and yearly period types", () => {
    expect(dashboardAnalyticsKey("daily", "2026-03-15")).toEqual([
      "analytics",
      "dashboard",
      "daily",
      "2026-03-15",
    ]);
    expect(dashboardAnalyticsKey("weekly", "2026-03-15")).toEqual([
      "analytics",
      "dashboard",
      "weekly",
      "2026-03-15",
    ]);
    expect(dashboardAnalyticsKey("yearly", "2026-01-01")).toEqual([
      "analytics",
      "dashboard",
      "yearly",
      "2026-01-01",
    ]);
  });
});
