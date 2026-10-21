import { apiGet, apiPost } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import { pickLocalized } from "@/lib/api/localized";
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
  description?: string | null;
  description_ar?: string | null;
};

type ApiMemberSubscription = {
  id: number;
  status?: string | null;
  expires_at?: string | null;
  end_date?: string | null;
  subscription?: ApiSubscription | null;
};

export function toPackage(item: ApiSubscription, locale: Locale): SubscriptionPackage {
  const name = pickLocalized(locale, item.name_ar, item.name_en, item.name || "");
  const description = item.description_ar || item.description || "";
  return {
    id: item.id,
    name,
    nameEn: item.name_en || item.name || name,
    durationMonths: Number(item.duration_months ?? 0),
    price: Number(item.price ?? 0),
    description,
    descriptionEn: item.description || description,
  };
}

export async function getSubscriptions(locale: Locale, token: string) {
  const data = await apiGet<ApiSubscription[]>("/subscriptions", locale, token, {
    active_only: true,
  });
  return asList<ApiSubscription>(data).map((item) => toPackage(item, locale));
}

export async function getMemberSubscriptions(locale: Locale, token: string) {
  const data = await apiGet<ApiMemberSubscription[]>(
    "/subscriptions/member/subscriptions",
    locale,
    token,
  );
  return asList<ApiMemberSubscription>(data).map((item) => ({
    id: item.id,
    status: item.status || "",
    packageName: item.subscription?.name_ar || item.subscription?.name || "",
    expiresAt: item.expires_at || item.end_date,
  })) satisfies MemberSubscription[];
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
    return items.some((item) => {
      const status = item.status.toLowerCase();
      return status.includes("active") || status.includes("ساري") || status.includes("فعال");
    });
  } catch {
    return false;
  }
}
