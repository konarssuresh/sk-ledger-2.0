"use client";

import { configureStore } from "@reduxjs/toolkit";
import userPreferencesReducer from "./userPreferenceSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      userPreferences: userPreferencesReducer,
    },
  });
}

export const store = makeStore();
