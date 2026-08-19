import { API_BASE_URL, apiUrl } from "@/lib/api/config";
import type { Locale } from "@/lib/i18n/config";

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  status_code?: number;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function localizationHeaders(locale?: Locale): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (locale) headers["X-localization"] = locale;
  return headers;
}

async function parseJson<T>(response: Response): Promise<ApiEnvelope<T>> {
  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    return {};
  }
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
      json.message ?? response.statusText,
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
): Promise<T> {
  const url =
    pathOrUrl.startsWith("http") || pathOrUrl.startsWith("/api/")
      ? pathOrUrl
      : apiUrl(pathOrUrl);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...localizationHeaders(locale),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await parseJson<T>(response);

  if (!response.ok) {
    throw new ApiError(
      json.status_code ?? response.status,
      json.message ?? response.statusText,
    );
  }

  return (json.data ?? json) as T;
}

export { API_BASE_URL };
