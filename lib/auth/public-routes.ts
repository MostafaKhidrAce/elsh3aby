import type { Locale } from "@/lib/i18n/config";

const PUBLIC_PATHS = ["/home", "/home/contact-us", "/home/about"] as const;

const AUTH_PREFIXES = [
  "/login",
  "/signup",
  "/forget-password",
] as const;

function stripLocale(pathname: string, locale: Locale): string {
  const prefix = `/${locale}`;
  if (pathname === prefix) return "/";
  if (pathname.startsWith(`${prefix}/`)) {
    return pathname.slice(prefix.length) || "/";
  }
  return pathname;
}

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

export function isPublicRoute(pathname: string, locale: Locale): boolean {
  const path = normalizePath(stripLocale(pathname, locale));
  return PUBLIC_PATHS.some((publicPath) => path === publicPath);
}

export function isAuthRoute(pathname: string, locale: Locale): boolean {
  const path = normalizePath(stripLocale(pathname, locale));
  return AUTH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

export function isAllowedWithoutAuth(
  pathname: string,
  locale: Locale,
): boolean {
  return isPublicRoute(pathname, locale) || isAuthRoute(pathname, locale);
}
