"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { LoginRequiredModal } from "@/components/auth/LoginRequiredModal";
import { useAuth } from "@/lib/auth/auth-context";
import { isAllowedWithoutAuth } from "@/lib/auth/public-routes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type LoginRequiredContextValue = {
  openLoginRequired: () => void;
  closeLoginRequired: () => void;
};

const LoginRequiredContext = createContext<LoginRequiredContextValue | null>(
  null,
);

type RouteGuardProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
};

export function RouteGuard({ locale, dictionary, children }: RouteGuardProps) {
  const pathname = usePathname();
  const { isAuthenticated, isReady } = useAuth();
  const [manualOpen, setManualOpen] = useState(false);
  const t = dictionary.auth.loginRequired;

  const allowed = isAllowedWithoutAuth(pathname, locale);
  const routeBlocked = !allowed && (!isReady || !isAuthenticated);
  const showChildren = allowed || (isReady && isAuthenticated);
  const showModal =
    (isReady && !isAuthenticated && !allowed) || manualOpen;

  const openLoginRequired = useCallback(() => {
    setManualOpen(true);
  }, []);

  const closeLoginRequired = useCallback(() => {
    setManualOpen(false);
  }, []);

  useEffect(() => {
    setManualOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!showModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showModal]);

  const contextValue = useMemo(
    () => ({
      openLoginRequired,
      closeLoginRequired,
    }),
    [openLoginRequired, closeLoginRequired],
  );

  return (
    <LoginRequiredContext.Provider value={contextValue}>
      {showChildren ? children : null}
      {showModal ? (
        <LoginRequiredModal
          locale={locale}
          title={t.title}
          description={t.description}
          loginLabel={t.login}
          nextPath={routeBlocked ? pathname : undefined}
          dismissible={!routeBlocked && manualOpen}
          onClose={closeLoginRequired}
        />
      ) : null}
    </LoginRequiredContext.Provider>
  );
}

export function useLoginRequired(): LoginRequiredContextValue {
  const context = useContext(LoginRequiredContext);
  if (!context) {
    throw new Error("useLoginRequired must be used within RouteGuard");
  }
  return context;
}
