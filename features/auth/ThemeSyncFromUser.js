"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMeQuery } from "@/features/auth/hooks";
import { setTheme } from "@/store/userPreferenceSlice";

// Syncs persisted user.theme from TanStack Query into Redux after login.

export default function ThemeSyncFromUser() {
  const dispatch = useDispatch();
  const { data } = useMeQuery({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    const userTheme = data?.user?.theme;
    if (userTheme === "light" || userTheme === "dark") {
      dispatch(setTheme(userTheme));
    }
  }, [data?.user?.theme, dispatch]);

  return null;
}
