"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { DashboardAlertModal } from "@/components/dashboard/DashboardAlertModal";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SubscriptionGateProvider } from "@/components/dashboard/SubscriptionGate";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type DashboardShellProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
};

export function DashboardShell({
  locale,
  dictionary,
  children,
}: DashboardShellProps) {
  const [open, setOpen] = useState(false);
  const [electionsUnavailableOpen, setElectionsUnavailableOpen] = useState(false);
  const t = dictionary.dashboard;
  const electionsCopy = dictionary.dashboard.electionsPage;
  const isAr = locale === "ar";

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <SubscriptionGateProvider locale={locale} dictionary={dictionary}>
    <div className="min-h-dvh bg-[#F5F5F5]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] gap-3 p-2 sm:gap-4 sm:p-3 lg:gap-5 lg:p-4">
        <div className="hidden w-[280px] shrink-0 lg:block xl:w-[300px]">
          <div className="sticky top-4 h-[calc(100dvh-2rem)]">
            <DashboardSidebar
              locale={locale}
              dictionary={dictionary}
              onElectionsUnavailable={() => setElectionsUnavailableOpen(true)}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-3 flex items-center lg:hidden sm:mb-4">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E5E5E5] bg-white text-[#133D3C]"
              aria-label={open ? t.closeMenu : t.openMenu}
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <main className="min-h-0 flex-1">{children}</main>
        </div>
      </div>

      {open ? (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label={t.closeMenu}
            className="fixed inset-0 z-40 bg-black/45"
            onClick={close}
          />
          <div
            className={`fixed inset-y-0 z-50 w-[min(88vw,320px)] p-2 ${
              isAr ? "right-0" : "left-0"
            }`}
          >
            <div className="relative h-full">
              <button
                type="button"
                aria-label={t.closeMenu}
                onClick={close}
                className={`absolute top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] bg-white text-[#133D3C] ${
                  isAr ? "left-3" : "right-3"
                }`}
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
              <DashboardSidebar
                locale={locale}
                dictionary={dictionary}
                onNavigate={close}
                onElectionsUnavailable={() => setElectionsUnavailableOpen(true)}
              />
            </div>
          </div>
        </div>
      ) : null}

      {electionsUnavailableOpen ? (
        <DashboardAlertModal
          locale={locale}
          title={electionsCopy.unavailableTitle}
          description={electionsCopy.unavailableDescription}
          confirmLabel={electionsCopy.ok}
          onConfirm={() => setElectionsUnavailableOpen(false)}
        />
      ) : null}
    </div>
    </SubscriptionGateProvider>
  );
}
