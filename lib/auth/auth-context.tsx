"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { logoutMember } from "@/lib/api/auth";
import { isLocale, type Locale } from "@/lib/i18n/config";
import {
  clearAuth,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
  type AuthUser,
} from "./token";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function localeFromPath(): Locale | undefined {
  if (typeof window === "undefined") return undefined;
  const first = window.location.pathname.split("/").filter(Boolean)[0];
  return first && isLocale(first) ? first : undefined;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTokenState(getToken());
    setUser(getStoredUser());
    setIsReady(true);
  }, []);

  const login = useCallback((nextUser: AuthUser, nextToken: string) => {
    setToken(nextToken);
    setStoredUser(nextUser);
    setTokenState(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    const currentToken = getToken();
    if (currentToken) {
      try {
        await logoutMember(currentToken, localeFromPath());
      } catch {
        // Clear local auth even if the API call fails.
      }
    }
    clearAuth();
    setTokenState(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isReady,
      login,
      logout,
    }),
    [token, user, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
