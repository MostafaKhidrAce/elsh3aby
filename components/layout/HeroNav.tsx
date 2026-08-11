"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const LOCALE_PREF_KEY = "elsh3aby_locale";

type HeroNavProps = {
  locale: Locale;
  dictionary: Dictionary;
  variant?: "hero" | "solid";
};

export function HeroNav({ locale, dictionary, variant = "hero" }: HeroNavProps) {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const t = dictionary.nav;
  const nextLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchHref =
    pathname.replace(`/${locale}`, `/${nextLocale}`) || `/${nextLocale}/home`;

  const links = [
    { href: `/${locale}/home`, label: t.home, match: "home" as const },
    { href: `/${locale}/home#events`, label: t.events, match: "hash" as const },
    { href: `/${locale}/home#news`, label: t.news, match: "hash" as const },
    {
      href: `/${locale}/home#excellence`,
      label: t.excellence,
      match: "hash" as const,
    },
    { href: `/${locale}/home#store`, label: t.store, match: "hash" as const },
    {
      href: `/${locale}/home/contact-us`,
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

  return (
    <header
      className={`relative z-20 w-full border-b border-white/20 ${
        variant === "solid" ? "bg-green-dark" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <Link href={`/${locale}/home`} className="flex shrink-0 items-center gap-3">
          <Image
            src="/logos/full-logo.svg"
            alt={dictionary.brand.name}
            width={180}
            height={64}
            className="h-12 w-auto max-w-[200px] object-contain sm:h-14"
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
                  highlighted ? "text-gold" : "text-white/90 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={switchHref}
            onClick={() => localStorage.setItem(LOCALE_PREF_KEY, nextLocale)}
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

          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-md bg-gold px-3 py-2 text-sm font-semibold text-green-dark"
            >
              <span>{t.logout}</span>
            </button>
          ) : (
            <Link
              href={`/${locale}/login`}
              dir="ltr"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-3 py-2 text-sm font-semibold text-green-dark"
            >
              {locale === "ar" ? (
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
          )}

          <button
            type="button"
            className="rounded-md border border-white/30 px-2.5 py-1.5 text-xs text-white lg:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
