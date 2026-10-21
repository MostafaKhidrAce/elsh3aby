import { apiGet, apiPost, apiPostForm, apiPut } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import { resolveMedia } from "@/lib/api/localized";
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

type ApiBankAccount = {
  id: number;
  bank_name?: string | null;
  account_type?: string | null;
  account_number?: string | null;
  iban_number?: string | null;
  logo_url?: string | null;
  is_visible?: boolean;
};

const BANK_COLORS = ["#1B5E20", "#0D47A1", "#B71C1C", "#4A148C", "#133D3C"];

export function toProfileView(item: ApiProfile): ProfileView {
  const genderRaw = item.gender;
  const female =
    genderRaw === 1 || genderRaw === "1" || genderRaw === "female" || genderRaw === "انثى";
  return {
    name: item.name || item.full_name || "",
    phone: item.phone || "",
    email: item.email || "",
    nationalId: item.national_id || "",
    familyBranch:
      item.family_branch?.name_ar || item.family_branch?.name_en || item.family_branch?.name || "",
    gender: female ? "female" : "male",
    birthDate: (item.date_of_birth || "").slice(0, 10),
    image: item.image_url || item.image ? resolveMedia(item.image_url || item.image) : null,
  };
}

export function toBankAccount(item: ApiBankAccount, index: number): FamilyBankAccount {
  const number = item.account_number || item.iban_number || "";
  const masked =
    number.length > 8
      ? `${number.slice(0, 4)} **** **** ${number.slice(-4)}`
      : number;
  return {
    id: String(item.id),
    bankName: item.bank_name || "",
    bankNameEn: item.bank_name || "",
    accountType: item.account_type || "",
    accountTypeEn: item.account_type || "",
    maskedNumber: masked,
    initial: (item.bank_name || "B").slice(0, 1),
    color: BANK_COLORS[index % BANK_COLORS.length],
  };
}

export async function getProfile(locale: Locale, token: string) {
  const data = await apiGet<ApiProfile>("/profile", locale, token);
  return toProfileView(data);
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
  const data = await apiGet<ApiBankAccount[]>("/bank-accounts", locale, token);
  return asList<ApiBankAccount>(data).map(toBankAccount);
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
