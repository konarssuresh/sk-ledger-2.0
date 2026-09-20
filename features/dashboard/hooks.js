"use client";

import { useQuery } from "@tanstack/react-query";
import {
  dashboardAnalyticsKey,
  fetchDashboardAnalyticsRequest,
} from "./api";

export function useDashboardAnalyticsQuery({ periodType, date }) {
  return useQuery({
    queryKey: dashboardAnalyticsKey(periodType, date),
    queryFn: () => fetchDashboardAnalyticsRequest({ periodType, date }),
  });
}
