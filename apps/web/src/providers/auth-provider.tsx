"use client";

import { createContext, useContext, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/hooks/use-auth";
import type { User } from "@/types";
import { useUIStore } from "@/stores/ui-store";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCustomer: boolean;
  isVendor: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { data: currentUser, isLoading: isQueryLoading, refetch } = useCurrentUser();

  // Sync OAuth tokens from cookie to localStorage and Zustand
  useEffect(() => {
    try {
      const match = document.cookie.match(/(?:^|;\s*)auth_sync_tokens=([^;]*)/);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]);
        const tokens = JSON.parse(decoded);
        
        if (tokens.accessToken && tokens.refreshToken) {
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          
          const { setAccessToken, setRefreshToken, setUser } = useAuthStore.getState();
          setAccessToken(tokens.accessToken);
          setRefreshToken(tokens.refreshToken);
          if (tokens.user) {
            setUser(tokens.user);
          }
          
          // Force refresh current user
          refetch();
          
          // Delete cookie
          document.cookie = "auth_sync_tokens=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      }
    } catch (err) {
      console.error('Failed to parse auth_sync_tokens:', err);
    }
  }, [refetch]);

  const value: AuthContextValue = {
    user: user || currentUser || null,
    isAuthenticated,
    isLoading: isLoading || isQueryLoading,
    isCustomer: user?.role === "CUSTOMER",
    isVendor: user?.role === "VENDOR",
    isAdmin: user?.role === "ADMIN",
    isModerator: user?.role === "MODERATOR",
    isSuperAdmin: user?.role === "SUPER_ADMIN",
  };

  useEffect(() => {
    if (!isAuthenticated) {
      useAuthStore.getState().setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleUnauthorized = () => {
      useAuthStore.getState().logout();
      useUIStore.getState().openModal("signin");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
