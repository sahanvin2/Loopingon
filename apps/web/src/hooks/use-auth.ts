"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api-client";
import type { User, ApiResponse } from "@/types";
import type { SignInInput, SignUpInput } from "@/lib/validators";
import { useAuthStore } from "@/stores/auth-store";

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export function useCurrentUser() {
  const { setUser, logout, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await get<ApiResponse<User>>("/auth/me");
      setUser(response.data);
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: SignInInput) => {
      const response = await post<ApiResponse<AuthResponse>>("/auth/signin", data);
      return response.data;
    },
    onSuccess: (data) => {
      const { setAccessToken, setRefreshToken } = useAuthStore.getState();
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: SignUpInput) => {
      const response = await post<ApiResponse<AuthResponse>>("/auth/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      const { setAccessToken, setRefreshToken } = useAuthStore.getState();
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      return post<ApiResponse<null>>("/auth/logout");
    },
    onSuccess: () => {
      logout();
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      queryClient.clear();
    },
    onError: () => {
      logout();
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      queryClient.clear();
    },
  });
}

export function useRefreshToken() {
  const { setUser, logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null;
      if (!refreshToken) throw new Error("No refresh token");
      const response = await post<ApiResponse<AuthResponse>>("/auth/refresh", {
        refreshToken,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const { setAccessToken, setRefreshToken } = useAuthStore.getState();
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
    onError: () => {
      logout();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      return post<ApiResponse<null>>("/auth/forgot-password", { email });
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      return post<ApiResponse<null>>("/auth/reset-password", data);
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (token: string) => {
      return post<ApiResponse<null>>("/auth/verify-email", { token });
    },
  });
}
