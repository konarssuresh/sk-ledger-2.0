"use client";

import { configureStore } from "@reduxjs/toolkit";
import userPreferencesReducer from "./userPreferenceSlice";
import calendarReducer from "./calendarSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      userPreferences: userPreferencesReducer,
      calendar: calendarReducer,
    },
  });
}

export const store = makeStore();
