"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTransactionRequest,
  deleteTransactionRequest,
  fetchMonthlySummaryRequest,
  fetchTransactionsForDayRequest,
  dayTransactionsKey,
  keysForTransactionDate,
  monthSummaryKey,
  updateTransactionRequest,
} from "./api";

export function useMonthlySummaryQuery({ year, month }) {
  return useQuery({
    queryKey: monthSummaryKey(year, month),
    queryFn: () => fetchMonthlySummaryRequest({ year, month }),
  });
}

export function useDayTransactionsQuery(dateKey) {
  return useQuery({
    queryKey: dayTransactionsKey(dateKey),
    queryFn: () => fetchTransactionsForDayRequest(dateKey),
    enabled: Boolean(dateKey),
  });
}

function invalidateTransactionCaches(queryClient, dateValue) {
  const { month, day } = keysForTransactionDate(dateValue);
  if (month) {
    queryClient.invalidateQueries({ queryKey: month });
  }
  if (day) {
    queryClient.invalidateQueries({ queryKey: day });
  }
  queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
}

function invalidateTransactionCachesForMutation(queryClient, variables) {
  invalidateTransactionCaches(queryClient, variables?.date);
  if (
    variables?.previousDate &&
    variables.previousDate !== variables.date
  ) {
    invalidateTransactionCaches(queryClient, variables.previousDate);
  }
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransactionRequest,
    onSuccess: (_data, variables) => {
      invalidateTransactionCaches(queryClient, variables.date);
    },
  });
}

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ previousDate: _previousDate, ...payload }) =>
      updateTransactionRequest(payload),
    onSuccess: (_data, variables) => {
      invalidateTransactionCachesForMutation(queryClient, variables);
    },
  });
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTransactionRequest,
    onSuccess: (_data, variables) => {
      invalidateTransactionCaches(queryClient, variables.date);
    },
  });
}
