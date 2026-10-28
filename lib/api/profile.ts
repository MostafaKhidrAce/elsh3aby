import { apiGet, apiGetRaw, apiPost, apiPostForm, apiPut } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import {
  pairFromUnknown,
  pairLocalized,
  pairNamed,
  pickNamed,
  resolveMedia,
} from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";
import type { FamilyBankAccount } from "@/lib/dashboard/dummy-profile";

export type ProfileView = {
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  familyBranch: string;
  gender: "male" | "female";
  birthDate: string;
  image: string | null;
};

type ApiProfile = {
  name?: string | null;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  national_id?: string | null;
  family_branch?: { name?: string | null; name_ar?: string | null; name_en?: string | null } | null;
  gender?: number | string | null;
  date_of_birth?: string | null;
  image?: string | null;
  image_url?: string | null;
};

type ApiNamed = {
  name?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  title?: string | null;
  title_ar?: string | null;
  title_en?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  image?: string | null;
};

type ApiBankAccount = {
  id: number;
  bank_name?: string | null;
  bank_name_ar?: string | null;
  bank_name_en?: string | null;
  name?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  account_type?: string | ApiNamed | null;
  account_type_ar?: string | null;
  account_type_en?: string | null;
  type?: string | ApiNamed | null;
  type_label?: string | null;
  type_label_ar?: string | null;
  type_label_en?: string | null;
  category?: string | ApiNamed | null;
  purpose?: string | null;
  purpose_ar?: string | null;
  purpose_en?: string | null;
  account_number?: string | null;
  iban?: string | null;
  iban_number?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  image?: string | null;
  image_url?: string | null;
  bank?: ApiNamed | null;
  is_visible?: boolean;
};

const BANK_COLORS = ["#1B5E20", "#0D47A1", "#B71C1C", "#4A148C", "#133D3C"];

export function toProfileView(item: ApiProfile, locale: Locale = "ar"): ProfileView {
  const genderRaw = item.gender;
  const female =
    genderRaw === 1 || genderRaw === "1" || genderRaw === "female" || genderRaw === "انثى";
  return {
    name: item.name || item.full_name || "",
    phone: item.phone || "",
    email: item.email || "",
    nationalId: item.national_id || "",
    familyBranch: pickNamed(locale, item.family_branch),
    gender: female ? "female" : "male",
    birthDate: (item.date_of_birth || "").slice(0, 10),
    image: item.image_url || item.image ? resolveMedia(item.image_url || item.image) : null,
  };
}

export function toBankAccount(item: ApiBankAccount, index: number): FamilyBankAccount {
  const number = (
    item.iban_number ||
    item.iban ||
    item.account_number ||
    ""
  ).replace(/\s+/g, "");
  const bank = item.bank
    ? pairNamed(item.bank, item.bank_name || "")
    : pairLocalized(item.bank_name_ar, item.bank_name_en || item.bank_name);
  const accountType = pairLocalized(
    item.type_label_ar ||
      item.purpose_ar ||
      item.account_type_ar ||
      (typeof item.account_type === "string" ? null : item.account_type?.name_ar) ||
      (typeof item.category === "string" ? null : item.category?.name_ar),
    item.type_label_en ||
      item.purpose_en ||
      item.account_type_en ||
      (typeof item.account_type === "string" ? item.account_type : item.account_type?.name_en) ||
      (typeof item.category === "string" ? item.category : item.category?.name_en) ||
      item.type_label ||
      item.purpose,
    typeof item.type === "string" ? item.type : "",
  );
  const nestedType =
    item.category && typeof item.category === "object"
      ? pairFromUnknown(item.category)
      : item.type && typeof item.type === "object"
        ? pairFromUnknown(item.type)
        : item.account_type && typeof item.account_type === "object"
          ? pairFromUnknown(item.account_type)
          : { ar: "", en: "" };
  const logo = resolveMedia(
    item.logo_url ||
      item.logo ||
      item.image_url ||
      item.image ||
      item.bank?.logo_url ||
      item.bank?.logo ||
      item.bank?.image,
    "",
  );
  const displayName = bank.ar || bank.en;
  return {
    id: String(item.id),
    bankName: bank.ar || displayName,
    bankNameEn: bank.en || displayName,
    accountType: accountType.ar || nestedType.ar,
    accountTypeEn: accountType.en || nestedType.en,
    accountNumber: number,
    logoUrl: logo || null,
    initial: (displayName || "B").slice(0, 1),
    color: BANK_COLORS[index % BANK_COLORS.length],
  };
}

export async function getProfile(locale: Locale, token: string) {
  const data = await apiGet<ApiProfile>("/profile", locale, token);
  return toProfileView(data, locale);
}

export async function updateProfile(
  payload: { name: string; gender: 0 | 1; phone: string; image?: File | null },
  locale: Locale,
  token: string,
) {
  const body = new FormData();
  body.append("name", payload.name);
  body.append("gender", String(payload.gender));
  body.append("phone", payload.phone);
  if (payload.image) body.append("image", payload.image);
  return apiPostForm("/profile", body, locale, token);
}

export async function getBankAccounts(locale: Locale, token: string) {
  const json = await apiGetRaw<Record<string, unknown>>("/bank-accounts", locale, token);
  return asList<ApiBankAccount>(json.data ?? json).map(toBankAccount);
}

export async function changePassword(
  payload: { old_password: string; new_password: string; confirm_password: string },
  locale: Locale,
  token: string,
) {
  return apiPost("/password/change", payload, locale, token);
}

export async function updateSettings(
  payload: { language?: string; notifications_enabled?: boolean },
  locale: Locale,
  token: string,
) {
  return apiPut("/settings", payload, locale, token);
}

export async function deleteAccount(
  payload: { password: string; confirmation?: string },
  locale: Locale,
  token: string,
) {
  return apiPost(
    "/settings/delete-account",
    { confirmation: "DELETE", ...payload },
    locale,
    token,
  );
}
