import { apiGet, apiGetPage, apiPost, type ApiQuery } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import { pickLocalized, resolveMedia } from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";
import type { DummyExcellence, ExcellencePraise } from "@/lib/dashboard/dummy-excellence";

type Named = { id?: number; name_ar?: string | null; name_en?: string | null };

type ApiExcellence = {
  id: number;
  title?: string | null;
  title_ar?: string | null;
  name?: string | null;
  description?: string | null;
  description_ar?: string | null;
  achievement?: string | null;
  achievement_ar?: string | null;
  image?: string | null;
  image_url?: string | null;
  age_category?: string | null;
  achievement_date?: string | null;
  year?: string | number | null;
  type_id?: number | null;
  type?: Named | null;
  family_branch?: Named | null;
  branch?: Named | null;
  member?: { name?: string | null } | null;
};

type ApiCommendation = {
  id: number;
  message?: string | null;
  commender_name?: string | null;
};

function ageGroup(value?: string | null): DummyExcellence["ageGroup"] {
  const raw = (value || "").toLowerCase();
  if (raw.includes("youth") || raw.includes("شاب")) return "youths";
  if (raw.includes("senior") || raw.includes("كبار")) return "seniors";
  return "adults";
}

export function toExcellence(item: ApiExcellence, locale: Locale): DummyExcellence {
  const name = item.title || item.title_ar || item.member?.name || item.name || "";
  const title = item.achievement || item.achievement_ar || pickLocalized(locale, item.type?.name_ar, item.type?.name_en);
  const bio = item.description_ar || item.description || "";
  const branch = pickLocalized(
    locale,
    item.family_branch?.name_ar,
    item.family_branch?.name_en,
    item.branch?.name_ar || item.branch?.name_en || "",
  );
  const year =
    String(item.year || "").trim() ||
    (item.achievement_date ? item.achievement_date.slice(0, 4) : "");
  return {
    id: String(item.id),
    category: "community",
    typeId: item.type_id ?? item.type?.id ?? 0,
    typeName: pickLocalized(locale, item.type?.name_ar, item.type?.name_en),
    name,
    nameEn: name,
    title,
    titleEn: title,
    year,
    bio,
    bioEn: item.description || bio,
    image: resolveMedia(item.image_url || item.image),
    branch,
    branchEn: branch,
    ageGroup: ageGroup(item.age_category),
    praises: [],
  };
}

export async function getExcellenceMembers(
  locale: Locale,
  token: string,
  query?: ApiQuery,
) {
  const page = await apiGetPage<ApiExcellence[]>(
    "/excellence-members",
    locale,
    token,
    { per_page: 15, ...query },
  );
  return {
    items: asList<ApiExcellence>(page.data).map((item) => toExcellence(item, locale)),
    meta: page.meta,
  };
}

export async function getExcellenceMember(
  id: string | number,
  locale: Locale,
  token: string,
) {
  const item = await apiGet<ApiExcellence>(`/excellence-members/${id}`, locale, token);
  return toExcellence(item, locale);
}

export async function getExcellenceCommendations(
  id: string | number,
  locale: Locale,
  token: string,
): Promise<ExcellencePraise[]> {
  try {
    const data = await apiGet<ApiCommendation[]>(
      `/excellence-members/${id}/commendations`,
      locale,
      token,
    );
    return asList<ApiCommendation>(data).map((item) => ({
      id: String(item.id),
      author: item.commender_name || (locale === "ar" ? "عضو" : "Member"),
      authorEn: item.commender_name || "Member",
      text: item.message || "",
      textEn: item.message || "",
    }));
  } catch {
    return [];
  }
}

export async function sendExcellenceCommendation(
  payload: {
    excellence_member_id: number;
    commender_name: string;
    commender_phone?: string;
    commender_email?: string;
    message: string;
  },
  locale: Locale,
  token: string,
) {
  return apiPost("/excellence-commendations", payload, locale, token);
}
