"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  googleLoginRequest,
  loginRequest,
  meQueryKey,
  meRequest,
  signupRequest,
} from "./api";

export function useMeQuery(options = {}) {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: meRequest,
    retry: false,
    ...options,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQueryKey });
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: signupRequest,
  });
}

export function useGoogleLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: googleLoginRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQueryKey });
    },
  });
}
