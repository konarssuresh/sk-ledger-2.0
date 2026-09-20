const {
  dashboardUiSlice,
  setPeriodType,
  goToPreviousPeriod,
  goToNextPeriod,
} = require("../store/dashboardUiSlice");

const { reducer } = dashboardUiSlice;

describe("dashboardUiSlice", () => {
  const initial = reducer(undefined, { type: "@@INIT" });

  it("defaults to monthly period and ISO date string", () => {
    expect(initial.periodType).toBe("monthly");
    expect(initial.currentDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("setPeriodType accepts allowed values only", () => {
    const daily = reducer(initial, setPeriodType("daily"));
    expect(daily.periodType).toBe("daily");

    const unchanged = reducer(daily, setPeriodType("invalid"));
    expect(unchanged.periodType).toBe("daily");
  });

  it("goToPreviousPeriod and goToNextPeriod shift currentDate", () => {
    const seeded = { ...initial, currentDate: "2026-02-15", periodType: "monthly" };
    const prev = reducer(seeded, goToPreviousPeriod());
    expect(prev.currentDate).toBe("2026-01-15");

    const next = reducer(prev, goToNextPeriod());
    expect(next.currentDate).toBe("2026-02-15");
  });

  it("shifts by day for daily period", () => {
    const seeded = { ...initial, currentDate: "2026-02-15", periodType: "daily" };
    const prev = reducer(seeded, goToPreviousPeriod());
    expect(prev.currentDate).toBe("2026-02-14");
  });
});
