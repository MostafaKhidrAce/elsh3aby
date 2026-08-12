"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const LOCALE_PREF_KEY = "elsh3aby_locale";

type HeroNavProps = {
  locale: Locale;
  dictionary: Dictionary;
  variant?: "hero" | "solid";
};

export function HeroNav({
  locale,
  dictionary,
  variant = "hero",
}: HeroNavProps) {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const t = dictionary.nav;
  const isAr = locale === "ar";
  const nextLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchHref =
    pathname.replace(`/${locale}`, `/${nextLocale}`) || `/${nextLocale}/home`;

  const links = [
    { href: `/${locale}/home`, label: t.home, match: "home" as const },
    {
      href: `/${locale}/home#events-section`,
      label: t.events,
      match: "hash" as const,
    },
    {
      href: `/${locale}/home#news-section`,
      label: t.news,
      match: "hash" as const,
    },
    {
      href: `/${locale}/home#about-section`,
      label: t.excellence,
      match: "hash" as const,
    },
    {
      href: `/${locale}/home#services-section`,
      label: t.store,
      match: "hash" as const,
    },
    {
      href: `/${locale}/home#contact-us-section`,
      label: t.contact,
      match: "contact" as const,
    },
  ];

  function isActive(match: "home" | "hash" | "contact") {
    if (match === "home") {
      return pathname === `/${locale}/home` || pathname === `/${locale}/home/`;
    }
    if (match === "contact") {
      return pathname.includes("/contact-us");
    }
    return false;
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function closeDrawer() {
    setOpen(false);
  }

  const langSwitch = (
    <Link
      href={switchHref}
      onClick={() => {
        localStorage.setItem(LOCALE_PREF_KEY, nextLocale);
        closeDrawer();
      }}
      className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-mid text-[10px]">
        {locale === "ar" ? "ع" : "EN"}
      </span>
      {t.lang}
      <span aria-hidden className="text-[10px] opacity-80">
        ▼
      </span>
    </Link>
  );

  const authAction = isAuthenticated ? (
    <button
      type="button"
      onClick={() => {
        logout();
        closeDrawer();
      }}
      className="inline-flex items-center gap-2 rounded-md bg-gold px-3 py-2 text-sm font-semibold text-green-dark"
    >
      <span>{t.logout}</span>
    </button>
  ) : (
    <Link
      href={`/${locale}/login`}
      dir="ltr"
      onClick={closeDrawer}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-3 py-2 text-sm font-semibold text-green-dark"
    >
      {isAr ? (
        <>
          <Image
            src="/arrows/green-left-arrow.svg"
            alt=""
            width={14}
            height={14}
            className="h-3.5 w-3.5 shrink-0"
          />
          <span>{t.login}</span>
        </>
      ) : (
        <>
          <span>{t.login}</span>
          <Image
            src="/arrows/green-left-arrow.svg"
            alt=""
            width={14}
            height={14}
            className="h-3.5 w-3.5 shrink-0 -scale-x-100"
          />
        </>
      )}
    </Link>
  );

  return (
    <header
      className={`relative z-20 w-full border-b border-white/20 ${
        variant === "solid" ? "bg-green-dark" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5 sm:py-4 lg:px-10">
        <Link
          href={`/${locale}/home`}
          className="flex shrink-0 items-center gap-3"
        >
          <Image
            src="/logos/full-logo.svg"
            alt={dictionary.brand.name}
            width={180}
            height={64}
            className="h-10 w-auto max-w-[160px] object-contain sm:h-12 sm:max-w-[180px] lg:h-14 lg:max-w-[200px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex">
          {links.map((link) => {
            const highlighted = isActive(link.match);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  highlighted ? "" : "text-white/90 hover:text-[#D5AF34]"
                }`}
                style={highlighted ? { color: "#D5AF34" } : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 lg:flex lg:gap-3">
            {langSwitch}
            {authAction}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/30 text-white transition hover:bg-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-black/50"
            onClick={closeDrawer}
          />
          <aside
            id="mobile-nav-drawer"
            className="fixed top-0 left-0 z-50 flex h-full w-[min(85vw,320px)] flex-col bg-[#133D3C] shadow-2xl"
            dir={isAr ? "rtl" : "ltr"}
          >
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-4">
              <Image
                src="/logos/full-logo.svg"
                alt={dictionary.brand.name}
                width={140}
                height={48}
                className="h-10 w-auto object-contain"
              />
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeDrawer}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/30 text-white"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
              {links.map((link) => {
                const highlighted = isActive(link.match);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeDrawer}
                    className={`rounded-md px-3 py-3 text-base font-medium transition ${
                      highlighted ? "bg-white/10" : "text-white hover:bg-white/5"
                    }`}
                    style={highlighted ? { color: "#D5AF34" } : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-3 border-t border-white/15 px-4 py-4">
              {langSwitch}
              {authAction}
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
