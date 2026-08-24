import { API_BASE_URL, apiUrl } from "@/lib/api/config";
import type { Locale } from "@/lib/i18n/config";

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  status_code?: number;
  errors?: Record<string, string[] | string>;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function localizationHeaders(
  locale?: Locale,
  token?: string | null,
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (locale) headers["X-localization"] = locale;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function envelopeMessage(json: ApiEnvelope<unknown>, fallback: string): string {
  if (json.message) return json.message;
  if (json.errors) {
    const first = Object.values(json.errors)[0];
    if (Array.isArray(first) && first[0]) return first[0];
    if (typeof first === "string") return first;
  }
  return fallback;
}

async function parseJson<T>(response: Response): Promise<ApiEnvelope<T>> {
  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    return {};
  }
}

function resolveUrl(pathOrUrl: string): string {
  return pathOrUrl.startsWith("http") || pathOrUrl.startsWith("/api/")
    ? pathOrUrl
    : apiUrl(pathOrUrl);
}

export async function apiGet<T>(path: string, locale?: Locale): Promise<T> {
  const response = await fetch(apiUrl(path), {
    headers: localizationHeaders(locale),
    cache: "no-store",
  });
  const json = await parseJson<T>(response);

  if (!response.ok || json.status_code === 404) {
    throw new ApiError(
      json.status_code ?? response.status,
      envelopeMessage(json, response.statusText),
    );
  }

  if (json.data === undefined) {
    throw new ApiError(response.status, json.message ?? "Invalid API response");
  }

  return json.data;
}

export async function apiPost<T>(
  pathOrUrl: string,
  body: unknown,
  locale?: Locale,
  token?: string | null,
): Promise<T> {
  const response = await fetch(resolveUrl(pathOrUrl), {
    method: "POST",
    headers: {
      ...localizationHeaders(locale, token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await parseJson<T>(response);

  if (!response.ok) {
    throw new ApiError(
      json.status_code ?? response.status,
      envelopeMessage(json, response.statusText),
    );
  }

  return (json.data ?? json) as T;
}

export async function apiPostForm<T>(
  path: string,
  body: FormData,
  locale?: Locale,
  token?: string | null,
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    headers: localizationHeaders(locale, token),
    body,
  });
  const json = await parseJson<T>(response);

  if (!response.ok) {
    throw new ApiError(
      json.status_code ?? response.status,
      envelopeMessage(json, response.statusText),
    );
  }

  return (json.data ?? json) as T;
}

export { API_BASE_URL };
