"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  categoriesQueryKey,
  createCategoryRequest,
  fetchCategoriesRequest,
} from "./api";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: fetchCategoriesRequest,
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategoryRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    },
  });
}
