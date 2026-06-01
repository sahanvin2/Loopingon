"use client";

import { createContext, useContext, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/hooks/use-auth";
import type { User } from "@/types";

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
  const { data: currentUser, isLoading: isQueryLoading } = useCurrentUser();

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
