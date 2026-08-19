export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://family-box.aksapp.com/api/v1";

export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
