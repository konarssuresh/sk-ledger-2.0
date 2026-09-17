import { createSlice, createSelector } from "@reduxjs/toolkit";

const toMonthKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
};

const toDateKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const now = new Date();

const initialState = {
  activeMonth: toMonthKey(now),
  selectedDay: toDateKey(now),
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setActiveMonth(state, action) {
      state.activeMonth = action.payload;
    },
    setSelectedDay(state, action) {
      state.selectedDay = action.payload;
    },
  },
});

export const { setActiveMonth, setSelectedDay } = calendarSlice.actions;

const calendarSelector = (state) => state.calendar || {};
const activeMonthKeySelector = createSelector(
  calendarSelector,
  (data) => data.activeMonth,
);

const selectedDayKeySelector = createSelector(
  calendarSelector,
  (data) => data.selectedDay,
);

const activeMonthSelector = createSelector(activeMonthKeySelector, (monthKey) => {
  const [year, month] = String(monthKey || "").split("-").map(Number);
  if (!year || !month) {
    const fallback = new Date();
    return new Date(fallback.getFullYear(), fallback.getMonth(), 1);
  }
  return new Date(year, month - 1, 1);
});

const selectedDaySelector = createSelector(selectedDayKeySelector, (dateKey) => {
  const parts = String(dateKey || "").split("-");
  const day = Number(parts[2]);
  return Number.isInteger(day) && day > 0 ? day : 1;
});

export const calendarSelectors = {
  activeMonthSelector,
  activeMonthKeySelector,
  selectedDaySelector,
  selectedDayKeySelector,
};

export default calendarSlice.reducer;
