import { API_BASE_URL, apiUrl } from "@/lib/api/config";
import type { Locale } from "@/lib/i18n/config";

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  status_code?: number;
  errors?: Record<string, string[] | string>;
  meta?: ApiMeta;
  links?: ApiLinks;
  categories?: unknown;
};

export type ApiMeta = {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number;
  to?: number;
};

export type ApiLinks = {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
};

export type Paginated<T> = {
  data: T;
  meta?: ApiMeta;
  links?: ApiLinks;
  message?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type ApiQuery = Record<
  string,
  string | number | boolean | null | undefined
>;

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

export function withQuery(path: string, query?: ApiQuery): string {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  if (!qs) return path;
  return path.includes("?") ? `${path}&${qs}` : `${path}?${qs}`;
}

function assertOk<T>(
  response: Response,
  json: ApiEnvelope<T>,
  allowMissingData = false,
): void {
  if (!response.ok || json.status_code === 404) {
    throw new ApiError(
      json.status_code ?? response.status,
      envelopeMessage(json, response.statusText),
    );
  }
  if (!allowMissingData && json.data === undefined) {
    throw new ApiError(response.status, json.message ?? "Invalid API response");
  }
}

export async function apiGet<T>(
  path: string,
  locale?: Locale,
  token?: string | null,
  query?: ApiQuery,
): Promise<T> {
  const response = await fetch(resolveUrl(withQuery(path, query)), {
    headers: localizationHeaders(locale, token),
    cache: "no-store",
  });
  const json = await parseJson<T>(response);
  assertOk(response, json);
  return json.data as T;
}

export async function apiGetPage<T>(
  path: string,
  locale?: Locale,
  token?: string | null,
  query?: ApiQuery,
): Promise<Paginated<T>> {
  const response = await fetch(resolveUrl(withQuery(path, query)), {
    headers: localizationHeaders(locale, token),
    cache: "no-store",
  });
  const json = await parseJson<T>(response);
  assertOk(response, json);
  return {
    data: json.data as T,
    meta: json.meta,
    links: json.links,
    message: json.message,
  };
}

export async function apiGetRaw<T extends Record<string, unknown>>(
  path: string,
  locale?: Locale,
  token?: string | null,
  query?: ApiQuery,
): Promise<T> {
  const response = await fetch(resolveUrl(withQuery(path, query)), {
    headers: localizationHeaders(locale, token),
    cache: "no-store",
  });
  const json = (await parseJson<unknown>(response)) as T & ApiEnvelope<unknown>;
  if (!response.ok || json.status_code === 404) {
    throw new ApiError(
      (json.status_code as number | undefined) ?? response.status,
      envelopeMessage(json, response.statusText),
    );
  }
  return json;
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
  const response = await fetch(resolveUrl(path), {
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

export async function apiPut<T>(
  path: string,
  body: unknown,
  locale?: Locale,
  token?: string | null,
): Promise<T> {
  const response = await fetch(resolveUrl(path), {
    method: "PUT",
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

export async function apiDelete<T>(
  path: string,
  locale?: Locale,
  token?: string | null,
): Promise<T | null> {
  const response = await fetch(resolveUrl(path), {
    method: "DELETE",
    headers: localizationHeaders(locale, token),
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
