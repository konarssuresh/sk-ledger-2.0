"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePasswordRequest,
  changePreferencesRequest,
  googleLoginRequest,
  loginRequest,
  meQueryKey,
  meRequest,
  signoutRequest,
  signupRequest,
  updateProfileRequest,
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

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQueryKey });
    },
  });
}

export function useChangePreferencesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changePreferencesRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQueryKey });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: changePasswordRequest,
  });
}

export function useSignoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signoutRequest,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: meQueryKey });
    },
  });
}
