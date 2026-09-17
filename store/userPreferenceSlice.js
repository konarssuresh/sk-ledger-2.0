import { createSlice, createSelector } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.localStorage.getItem("skledger-theme") === "dark"
    ? "dark"
    : "light";
};

const initialState = {
  theme: getInitialTheme(),
};

const userPreferenceSlice = createSlice({
  name: "userPreference",
  initialState,
  reducers: {
    setTheme(state, action) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("skledger-theme", action.payload);
      }
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = userPreferenceSlice.actions;

const userPreferenceSelector = (state) => state?.userPreferences;

export const themeSelector = createSelector(
  userPreferenceSelector,
  (data) => data?.theme || "light",
);

export default userPreferenceSlice.reducer;
