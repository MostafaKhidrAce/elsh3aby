import { apiGet, apiGetPage, ApiError, apiPost, type ApiMeta, type ApiQuery } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import type { Locale } from "@/lib/i18n/config";

export type LocalizedCta = {
  label_ar?: string | null;
  label_en?: string | null;
  url?: string | null;
};

export type WebsiteStatItem = {
  id: number;
  label_ar?: string | null;
  label_en?: string | null;
  number?: number | string | null;
  value_ar?: string | null;
  value_en?: string | null;
  icon_url?: string | null;
};

export type WebsiteHeroSlide = {
  background_url?: string | null;
  title_ar?: string | null;
  title_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
};

export type WebsiteServiceItem = {
  id: number;
  title_ar?: string | null;
  title_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  image_url?: string | null;
  link_url?: string | null;
};

export type WebsiteEventItem = {
  id: number;
  title_ar?: string | null;
  title_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  body_ar?: string | null;
  body_en?: string | null;
  date?: string | null;
  start_date?: string | null;
  event_date?: string | null;
  published_at?: string | null;
  location?: string | null;
  location_ar?: string | null;
  location_en?: string | null;
  address_ar?: string | null;
  address_en?: string | null;
  image_url?: string | null;
  icon?: string | null;
};

export type WebsiteNewsItem = {
  id: number;
  title_ar?: string | null;
  title_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  body_ar?: string | null;
  body_en?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  published_at?: string | null;
};

export type WebsiteFaqItem = {
  id: number;
  question_ar?: string | null;
  question_en?: string | null;
  answer_ar?: string | null;
  answer_en?: string | null;
};

export type WebsiteSocial = {
  whatsapp?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  x?: string | null;
  snapchat?: string | null;
};

export type WebsiteMenuLink = {
  label_ar?: string | null;
  label_en?: string | null;
  url?: string | null;
};

export type WebsiteFooter = {
  brand_name_ar?: string | null;
  brand_name_en?: string | null;
  cta?: LocalizedCta | null;
  address_ar?: string | null;
  address_en?: string | null;
  email?: string | null;
  phone?: string | null;
  social?: WebsiteSocial | null;
  menu_links?: WebsiteMenuLink[] | null;
  newsletter?: {
    title_ar?: string | null;
    title_en?: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    subscribe_endpoint?: string | null;
  } | null;
  copyright_ar?: string | null;
  copyright_en?: string | null;
};

export type WebsiteHomeData = {
  hero?: {
    slides?: WebsiteHeroSlide[] | null;
    background_url?: string | string[] | null;
    title_ar?: string | null;
    title_en?: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    cta1?: LocalizedCta | null;
    cta2?: LocalizedCta | null;
    stats?: WebsiteStatItem[] | null;
  } | null;
  about_teaser?: {
    eyebrow_ar?: string | null;
    eyebrow_en?: string | null;
    title_ar?: string | null;
    title_en?: string | null;
    body_ar?: string | null;
    body_en?: string | null;
    button?: LocalizedCta | null;
    email?: string | null;
    phone?: string | null;
    experience?: {
      value?: string | null;
      label_ar?: string | null;
      label_en?: string | null;
    } | null;
  } | null;
  services?: {
    eyebrow_ar?: string | null;
    eyebrow_en?: string | null;
    title_ar?: string | null;
    title_en?: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    items?: WebsiteServiceItem[] | null;
  } | null;
  events_section?: {
    title_ar?: string | null;
    title_en?: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    cta?: LocalizedCta | null;
    items?: WebsiteEventItem[] | null;
  } | null;
  news_section?: {
    eyebrow_ar?: string | null;
    eyebrow_en?: string | null;
    title_ar?: string | null;
    title_en?: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    highlights?: WebsiteNewsItem[] | null;
    latest?: WebsiteNewsItem[] | null;
  } | null;
  join?: {
    title_ar?: string | null;
    title_en?: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    image_url?: string | null;
  } | null;
  footer?: WebsiteFooter | null;
};

export type WebsiteAboutData = {
  hero?: {
    background_url?: string | null;
    title_ar?: string | null;
    title_en?: string | null;
  } | null;
  lineage?: {
    eyebrow_ar?: string | null;
    eyebrow_en?: string | null;
    title_ar?: string | null;
    title_en?: string | null;
    body_ar?: string | null;
    body_en?: string | null;
    experience?: {
      value?: string | null;
      label_ar?: string | null;
      label_en?: string | null;
    } | null;
  } | null;
  aims?: {
    eyebrow_ar?: string | null;
    eyebrow_en?: string | null;
    title_ar?: string | null;
    title_en?: string | null;
    body_ar?: string | null;
    body_en?: string | null;
    features?: { id: number; text_ar?: string | null; text_en?: string | null }[] | null;
  } | null;
  quick_stats?: {
    eyebrow_ar?: string | null;
    eyebrow_en?: string | null;
    title_ar?: string | null;
    title_en?: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    items?: WebsiteStatItem[] | null;
  } | null;
  faq?: {
    title_ar?: string | null;
    title_en?: string | null;
    items?: WebsiteFaqItem[] | null;
  } | null;
  footer?: WebsiteFooter | null;
};

export type WebsiteContactData = {
  hero?: {
    title_ar?: string | null;
    title_en?: string | null;
    background_url?: string | null;
  } | null;
  intro_ar?: string | null;
  intro_en?: string | null;
  form?: {
    title_ar?: string | null;
    title_en?: string | null;
    intro_ar?: string | null;
    intro_en?: string | null;
    submit_endpoint?: string | null;
    message_types_endpoint?: string | null;
  } | null;
  cards?: {
    email?: string | null;
    phone?: string | null;
    address_ar?: string | null;
    address_en?: string | null;
    map_embed_url?: string | null;
  } | null;
  map_embed_url?: string | null;
  footer?: WebsiteFooter | null;
};

export type MessageType = {
  id: number;
  name_ar?: string | null;
  name_en?: string | null;
};

const requestCache = new Map<string, Promise<unknown>>();

function remember<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = requestCache.get(key);
  if (existing) return existing as Promise<T>;
  const promise = fn();
  requestCache.set(key, promise);
  return promise;
}

async function safeGet<T>(path: string, locale: Locale): Promise<T | null> {
  try {
    return await apiGet<T>(path, locale);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    console.error(`Failed to fetch ${path}`, error);
    return null;
  }
}

export function getWebsiteHome(locale: Locale) {
  return remember(`home:${locale}`, () =>
    safeGet<WebsiteHomeData>("/website/home", locale),
  );
}

export function getWebsiteAbout(locale: Locale) {
  return remember(`about:${locale}`, () =>
    safeGet<WebsiteAboutData>("/website/about", locale),
  );
}

export function getWebsiteContact(locale: Locale) {
  return remember(`contact:${locale}`, () =>
    safeGet<WebsiteContactData>("/website/contact", locale),
  );
}

export function getWebsiteFooter(locale: Locale) {
  return remember(`footer:${locale}`, async () => {
    const footer = await safeGet<WebsiteFooter>("/website/footer", locale);
    if (footer) return footer;

    const home = await getWebsiteHome(locale);
    if (home?.footer) return home.footer;

    const contact = await getWebsiteContact(locale);
    return contact?.footer ?? null;
  });
}

export function getMessageTypes(locale: Locale) {
  return remember(`message-types:${locale}`, async () => {
    try {
      return await apiGet<MessageType[]>("/message-types", locale);
    } catch (error) {
      console.error("Failed to fetch message types", error);
      return [] as MessageType[];
    }
  });
}

export async function subscribeNewsletter(
  email: string,
  _endpoint?: string | null,
  locale?: Locale,
) {
  return apiPost("/website/newsletter", { email }, locale);
}

export async function submitContactMessage(
  payload: {
    name: string;
    phone: string;
    email?: string;
    message_type_id: number;
    subject: string;
    message: string;
  },
  locale?: Locale,
) {
  const body: Record<string, string | number> = {
    name: payload.name,
    phone: payload.phone,
    message_type_id: payload.message_type_id,
    subject: payload.subject,
    message: payload.message,
  };
  if (payload.email) body.email = payload.email;

  return apiPost("/contact", body, locale);
}

export type PublicListQuery = {
  page?: number;
  per_page?: number;
  search?: string;
  type_id?: string | number;
  date?: string;
  scope?: string;
  branch?: string | number;
};

export type PublicListResult<T> = {
  items: T[];
  meta: ApiMeta | null;
  unavailable: boolean;
};

function listMeta(meta: ApiMeta | undefined, data: unknown): ApiMeta | null {
  if (meta?.current_page || meta?.last_page || meta?.total) return meta;
  if (!data || typeof data !== "object" || Array.isArray(data)) return meta ?? null;
  const record = data as Record<string, unknown>;
  const nested = record.meta;
  if (nested && typeof nested === "object") return nested as ApiMeta;
  if (typeof record.current_page === "number" || typeof record.last_page === "number") {
    return {
      current_page: typeof record.current_page === "number" ? record.current_page : undefined,
      last_page: typeof record.last_page === "number" ? record.last_page : undefined,
      per_page: typeof record.per_page === "number" ? record.per_page : undefined,
      total: typeof record.total === "number" ? record.total : undefined,
    };
  }
  return meta ?? null;
}

async function getPublicList<T>(
  path: string,
  locale: Locale,
  query: PublicListQuery,
): Promise<PublicListResult<T>> {
  const params: ApiQuery = {
    page: query.page ?? 1,
    per_page: query.per_page ?? 9,
    search: query.search,
    type_id: query.type_id,
    date: query.date,
    scope: query.scope,
    branch: query.branch,
  };
  try {
    const page = await apiGetPage<unknown>(path, locale, null, params);
    return {
      items: asList<T>(page.data),
      meta: listMeta(page.meta, page.data),
      unavailable: false,
    };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 401)) {
      return { items: [], meta: null, unavailable: true };
    }
    console.error(`Failed to fetch ${path}`, error);
    return { items: [], meta: null, unavailable: true };
  }
}

export function getPublicNews(locale: Locale, query: PublicListQuery = {}) {
  return getPublicList<WebsiteNewsItem>("/website/news", locale, query);
}

export function getPublicNewsItem(locale: Locale, id: string | number) {
  return safeGet<WebsiteNewsItem>(`/website/news/${id}`, locale);
}

export function getPublicEvents(locale: Locale, query: PublicListQuery = {}) {
  return getPublicList<WebsiteEventItem>("/website/events", locale, query);
}

export function getPublicEvent(locale: Locale, id: string | number) {
  return safeGet<WebsiteEventItem>(`/website/events/${id}`, locale);
}
