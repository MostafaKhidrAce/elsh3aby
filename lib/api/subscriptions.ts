import { apiGet, apiGetRaw, apiPost } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import { pairLocalized, pickLocalized } from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";

export type SubscriptionPackage = {
  id: number;
  name: string;
  nameEn: string;
  durationMonths: number;
  price: number;
  description: string;
  descriptionEn: string;
};

export type MemberSubscription = {
  id: number;
  status: string;
  paymentStatus: string;
  isActive?: boolean | null;
  packageName: string;
  expiresAt?: string | null;
};

type ApiSubscription = {
  id: number;
  name?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  duration_months?: number | null;
  price?: string | number | null;
  is_active?: boolean | number | string | null;
  description?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
};

type ApiMemberSubscription = {
  id?: number | string | null;
  status?: string | null;
  payment_status?: string | null;
  is_active?: boolean | number | string | null;
  active?: boolean | number | string | null;
  duration_months?: number | null;
  display_kind?: string | null;
  display_name?: string | null;
  price?: string | number | null;
  name?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  expires_at?: string | null;
  end_date?: string | null;
  ends_at?: string | null;
  subscription_id?: number | null;
  subscription?: ApiSubscription | null;
};

function asFlag(value: boolean | number | string | null | undefined): boolean | null {
  if (value === true || value === 1 || value === "1" || value === "true") return true;
  if (value === false || value === 0 || value === "0" || value === "false") return false;
  return null;
}

function isExpired(value?: string | null): boolean {
  if (!value) return false;
  const time = Date.parse(value.replace(" ", "T"));
  return !Number.isNaN(time) && time < Date.now();
}

function isInactiveLabel(value: string): boolean {
  return /\b(expired|cancelled|canceled|inactive|unpaid|rejected|failed|pending)\b|منته|ملغ|غير فعال|غير مدفوع|معلق/.test(
    value,
  );
}

function isSubscriptionLike(item: Record<string, unknown>): boolean {
  return (
    item.is_active != null ||
    item.active != null ||
    item.duration_months != null ||
    item.display_kind != null ||
    item.display_name != null ||
    item.subscription != null ||
    item.subscription_id != null ||
    item.payment_status != null ||
    item.expires_at != null ||
    item.end_date != null ||
    (item.price != null && (item.name_ar != null || item.name != null))
  );
}

function collectSubscriptionRecords(value: unknown, depth = 0): ApiMemberSubscription[] {
  if (value == null || depth > 4) return [];
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectSubscriptionRecords(item, depth + 1));
  }
  if (typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  if (isSubscriptionLike(record)) return [record as ApiMemberSubscription];
  const nested = [
    record.data,
    record.subscriptions,
    record.member_subscriptions,
    record.items,
    record.current,
  ];
  return nested.flatMap((item) => collectSubscriptionRecords(item, depth + 1));
}

export function isLiveMemberSubscription(item: MemberSubscription): boolean {
  if (item.isActive === false) return false;
  if (isExpired(item.expiresAt)) return false;
  const labels = `${item.status} ${item.paymentStatus}`.toLowerCase();
  if (isInactiveLabel(labels)) return false;
  return item.isActive === true || Boolean(item.id);
}

export function toPackage(item: ApiSubscription, locale: Locale): SubscriptionPackage {
  const name = pairLocalized(item.name_ar, item.name_en || item.name);
  const description = pairLocalized(item.description_ar, item.description_en || item.description);
  return {
    id: item.id,
    name: pickLocalized(locale, name.ar, name.en),
    nameEn: name.en,
    durationMonths: Number(item.duration_months ?? 0),
    price: Number(item.price ?? 0),
    description: description.ar,
    descriptionEn: description.en,
  };
}

export async function getSubscriptions(locale: Locale, token: string) {
  const data = await apiGet<ApiSubscription[]>("/subscriptions", locale, token, {
    active_only: true,
  });
  return asList<ApiSubscription>(data).map((item) => toPackage(item, locale));
}

function toMemberSubscription(
  item: ApiMemberSubscription,
  locale: Locale,
): MemberSubscription {
  return {
    id: Number(item.id ?? item.subscription_id ?? item.subscription?.id ?? 0),
    status: String(item.status ?? ""),
    paymentStatus: String(item.payment_status ?? ""),
    isActive: asFlag(item.is_active ?? item.active ?? item.subscription?.is_active),
    packageName: pickLocalized(
      locale,
      item.name_ar ?? item.subscription?.name_ar,
      item.name_en ?? item.subscription?.name_en,
      item.name || item.display_name || item.subscription?.name || "",
    ),
    expiresAt: item.expires_at || item.end_date || item.ends_at,
  };
}

export async function getMemberSubscriptions(locale: Locale, token: string) {
  const payloads: unknown[] = [];
  for (const path of [
    "/subscriptions/member/subscriptions",
    "/subscriptions/member",
  ]) {
    try {
      payloads.push(await apiGetRaw<Record<string, unknown>>(path, locale, token));
    } catch {
      // Try the next member-subscription path.
    }
  }
  try {
    payloads.push(
      await apiGetRaw<Record<string, unknown>>("/subscriptions", locale, token, {
        active_only: true,
      }),
    );
  } catch {
    // Catalog fallback is optional.
  }

  const records = payloads.flatMap((payload) => collectSubscriptionRecords(payload));
  const unique = new Map<string, ApiMemberSubscription>();
  for (const item of records) {
    const key = String(item.id ?? item.subscription_id ?? item.name_ar ?? item.name ?? unique.size);
    unique.set(key, item);
  }
  return [...unique.values()].map((item) => toMemberSubscription(item, locale));
}

export async function subscribeToPackage(
  id: string | number,
  locale: Locale,
  token: string,
) {
  return apiPost(`/subscriptions/${id}/subscribe`, { payment_method: "credit_card" }, locale, token);
}

export async function hasLiveActivePackage(locale: Locale, token: string) {
  try {
    const items = await getMemberSubscriptions(locale, token);
    return items.some((item) => item.isActive === true || isLiveMemberSubscription(item));
  } catch {
    return false;
  }
}
