"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { SubscriptionRequiredModal } from "@/components/dashboard/requests/SubscriptionRequiredModal";
import { hasLiveActivePackage } from "@/lib/api/subscriptions";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const ADD_ROUTES: { match: string; parent: string }[] = [
  { match: "/dashboard/add-event", parent: "/dashboard/events" },
  { match: "/dashboard/add-request", parent: "/dashboard/requests" },
  { match: "/dashboard/add-consultation", parent: "/dashboard/requests" },
  { match: "/dashboard/add-offer", parent: "/dashboard/requests" },
  { match: "/dashboard/add-publish-news", parent: "/dashboard/requests" },
  { match: "/dashboard/booking/new", parent: "/dashboard/booking" },
  { match: "/dashboard/elections/nominate", parent: "/dashboard/elections" },
];

export function isAddRoute(pathname: string) {
  return ADD_ROUTES.some((item) => pathname.includes(item.match));
}

function parentPath(pathname: string, locale: Locale) {
  const found = ADD_ROUTES.find((item) => pathname.includes(item.match));
  return `/${locale}${found?.parent ?? "/dashboard"}`;
}

type SubscriptionGateValue = {
  packageActive: boolean | null;
  ensureCanAdd: () => Promise<boolean>;
  requireAdd: (event: MouseEvent<HTMLElement>, href: string) => Promise<void>;
};

const SubscriptionGateContext = createContext<SubscriptionGateValue | null>(
  null,
);

type SubscriptionGateProviderProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
};

export function SubscriptionGateProvider({
  locale,
  dictionary,
  children,
}: SubscriptionGateProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, isReady } = useAuth();
  const t = dictionary.dashboard.requestsPage;
  const [packageActive, setPackageActive] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setPackageActive(false);
      return false;
    }
    const active = await hasLiveActivePackage(locale, token);
    setPackageActive(active);
    return active;
  }, [locale, token]);

  useEffect(() => {
    if (!isReady) return;
    void refresh();
  }, [isReady, refresh]);

  const onAddRoute = isAddRoute(pathname);

  useEffect(() => {
    if (pathname.includes("/dashboard/packages")) {
      setModalOpen(false);
      return;
    }
    if (!onAddRoute || packageActive !== false) return;
    setModalOpen(true);
  }, [onAddRoute, packageActive, pathname]);

  const ensureCanAdd = useCallback(async () => {
    const active = await refresh();
    if (active) {
      setModalOpen(false);
      return true;
    }
    setModalOpen(true);
    return false;
  }, [refresh]);

  const requireAdd = useCallback(
    async (event: MouseEvent<HTMLElement>, href: string) => {
      event.preventDefault();
      const allowed = await ensureCanAdd();
      if (allowed) router.push(href);
    },
    [ensureCanAdd, router],
  );

  function handleClose() {
    setModalOpen(false);
    if (onAddRoute) {
      router.replace(parentPath(pathname, locale));
    }
  }

  const value = useMemo(
    () => ({ packageActive, ensureCanAdd, requireAdd }),
    [packageActive, ensureCanAdd, requireAdd],
  );

  return (
    <SubscriptionGateContext.Provider value={value}>
      {children}
      {modalOpen ? (
        <SubscriptionRequiredModal
          locale={locale}
          title={t.subscriptionRequiredTitle}
          description={t.subscriptionRequiredDescription}
          goToPackagesLabel={t.goToPackages}
          cancelLabel={t.cancel}
          packagesHref={`/${locale}/dashboard/packages`}
          onClose={handleClose}
          onGoToPackages={() => setModalOpen(false)}
        />
      ) : null}
    </SubscriptionGateContext.Provider>
  );
}

export function useSubscriptionGate() {
  const context = useContext(SubscriptionGateContext);
  if (!context) {
    throw new Error("useSubscriptionGate must be used within SubscriptionGateProvider");
  }
  return context;
}

type SubscriptionAddLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function SubscriptionAddLink({
  href,
  className,
  children,
}: SubscriptionAddLinkProps) {
  const { requireAdd } = useSubscriptionGate();
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        void requireAdd(event, href);
      }}
    >
      {children}
    </a>
  );
}
