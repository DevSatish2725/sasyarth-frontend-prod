"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { setAccessToken } from "@/lib/auth.token";

import { authService } from "@/services/auth.service";

import type { AuthUser } from "@/types/auth.types";

import { useRouter } from "next/navigation";
import {
  LANGUAGE_STORAGE_KEY,
  setClientLanguage,
} from "@/utils/language.utils";
import { isSupportedLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  accessTokenSetter: (accessToken: string) => void;

  getUserProfile: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const applyAuthenticatedUser = useCallback((user: AuthUser) => {
    setUser(user);
    const language: Locale = isSupportedLocale(user.preferredLanguage)
      ? user.preferredLanguage
      : "en";

    setClientLanguage(language);
  }, []);

  const applyGuestLanguage = useCallback(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    const language: Locale =
      storedLanguage && isSupportedLocale(storedLanguage)
        ? storedLanguage
        : "en";

    setClientLanguage(language);
  }, []);

  const accessTokenSetter = useCallback((accessToken: string) => {
    setAccessToken(accessToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      router.replace("/");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, [router]);

  const getUserProfile = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const response = await authService.getMe();
      applyAuthenticatedUser(response.data);
      return response.data;
    } catch (error) {
      setAccessToken(null);
      setUser(null);

      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        console.error("Failed to restore auth session", error);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [applyAuthenticatedUser]);

  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      try {
        const response = await authService.getMe();

        if (cancelled) {
          return;
        }

        applyAuthenticatedUser(response.data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        applyGuestLanguage();

        setAccessToken(null);
        setUser(null);

        if (!axios.isAxiosError(error)) {
          console.error("Unexpected auth initialization error:", error);
          return;
        }

        if (error.response?.status === 401) {
          return;
        }

        if (!error.response) {
          if (process.env.NODE_ENV === "development") {
            console.warn("GreenBridge API is unavailable.");
          }
          return;
        }

        console.error(
          `Failed to restore auth session (${error.response.status})`,
          error,
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, [applyAuthenticatedUser, applyGuestLanguage]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        accessTokenSetter,
        getUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
