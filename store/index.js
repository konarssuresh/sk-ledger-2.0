"use client";

import { configureStore } from "@reduxjs/toolkit";
import userPreferencesReducer from "./userPreferenceSlice";
import calendarReducer from "./calendarSlice";
import transactionUiReducer from "./transactionUiSlice";
import dashboardUiReducer from "./dashboardUiSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      userPreferences: userPreferencesReducer,
      calendar: calendarReducer,
      transactionUi: transactionUiReducer,
      dashboardUi: dashboardUiReducer,
    },
  });
}

export const store = makeStore();
