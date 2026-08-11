"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

const LOCALE_PREF_KEY = "elsh3aby_locale";

type LanguageSwitcherProps = {
  locale: Locale;
  labelAr?: string;
  labelEn?: string;
};

export function LanguageSwitcher({
  locale,
  labelAr = "العربية",
  labelEn = "English",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const nextLocale: Locale = locale === "ar" ? "en" : "ar";
  const href = pathname.replace(`/${locale}`, `/${nextLocale}`) || `/${nextLocale}/home`;

  return (
    <Link
      href={href}
      className="text-sm font-medium text-muted transition-colors hover:text-foreground"
      onClick={() => {
        localStorage.setItem(LOCALE_PREF_KEY, nextLocale);
      }}
    >
      {nextLocale === "ar" ? labelAr : labelEn}
    </Link>
  );
}
