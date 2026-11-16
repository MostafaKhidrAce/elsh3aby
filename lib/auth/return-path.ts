import type { Locale } from "@/lib/i18n/config";

export function safeReturnPath(
  locale: Locale,
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  let path = value.trim();
  try {
    path = decodeURIComponent(path);
  } catch {
    return null;
  }
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\") ||
    path.includes("://")
  ) {
    return null;
  }
  const prefix = `/${locale}/`;
  if (path !== `/${locale}` && !path.startsWith(prefix)) return null;
  return path;
}
