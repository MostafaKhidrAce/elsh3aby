import { ApiError, apiGet, apiPost, apiPostForm } from "@/lib/api/client";
import type { Locale } from "@/lib/i18n/config";
import type { AuthUser } from "@/lib/auth/token";

export const BLOOD_TYPES = [
  "O+",
  "O-",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
] as const;

export const REGISTER_DEVICE_TYPE = "ANDROID";

export type FamilyBranch = {
  id: number;
  name_ar?: string | null;
  name_en?: string | null;
};

type AuthMember = {
  name?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  image?: string | null;
  image_url?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
};

type AuthPayload = {
  token?: string | null;
  access_token?: string | null;
  authorization?: {
    type?: string | null;
    token?: string | null;
    access_token?: string | null;
    refresh_token?: string | null;
  } | null;
  user?: AuthMember | null;
  member?: AuthMember | null;
} & AuthMember;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function pickStringToken(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function pickToken(payload: Record<string, unknown>): string | null {
  const direct =
    pickStringToken(payload.token) || pickStringToken(payload.access_token);
  if (direct) return direct;
  const authorization = asRecord(payload.authorization);
  if (!authorization) return null;
  return (
    pickStringToken(authorization.token) ||
    pickStringToken(authorization.access_token)
  );
}

function pickMember(payload: AuthPayload): AuthMember {
  return payload.user ?? payload.member ?? payload;
}

export function toAuthUser(payload: unknown, fallback: AuthUser): AuthUser {
  const record = asRecord(payload) as AuthPayload | null;
  if (!record) return fallback;
  const member = pickMember(record);
  return {
    name: member.name || member.full_name || fallback.name,
    emailOrPhone: member.phone || member.email || fallback.emailOrPhone,
    phone: member.phone || fallback.phone || null,
    email: member.email || fallback.email || null,
    avatarUrl:
      member.image_url ||
      member.avatar_url ||
      member.image ||
      member.avatar ||
      fallback.avatarUrl ||
      null,
  };
}

export function extractAuthToken(payload: unknown): string | null {
  const record = asRecord(payload);
  if (!record) return null;
  const direct = pickToken(record);
  if (direct) return direct;
  const nested = asRecord(record.data);
  return nested ? pickToken(nested) : null;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.message.trim()) return error.message;
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

export async function getFamilyBranches(locale?: Locale) {
  return apiGet<FamilyBranch[]>("/family-branches", locale);
}

export async function loginMember(
  nationalId: string,
  password: string,
  locale?: Locale,
) {
  const body = new FormData();
  body.append("national_id", nationalId);
  body.append("password", password);
  return apiPostForm<AuthPayload>("/login", body, locale);
}

export type RegisterPayload = {
  name: string;
  phone: string;
  password: string;
  family_branch_id: number;
  gender: 0 | 1;
  player_id: string;
  type: string;
  email?: string;
  national_id: string;
  date_of_birth?: string;
  blood_type?: string;
  image?: File | null;
};

export async function registerMember(payload: RegisterPayload, locale?: Locale) {
  const body = new FormData();
  body.append("name", payload.name);
  body.append("phone", payload.phone);
  body.append("password", payload.password);
  body.append("family_branch_id", String(payload.family_branch_id));
  body.append("gender", String(payload.gender));
  body.append("player_id", payload.player_id);
  body.append("type", payload.type || REGISTER_DEVICE_TYPE);
  body.append("national_id", payload.national_id);
  body.append("date_of_birth_calendar", "gregorian");
  if (payload.email) body.append("email", payload.email);
  if (payload.date_of_birth) body.append("date_of_birth", payload.date_of_birth);
  if (payload.blood_type) body.append("blood_type", payload.blood_type);
  if (payload.image) body.append("image", payload.image);
  return apiPostForm("/register", body, locale);
}

export async function logoutMember(token: string, locale?: Locale) {
  return apiPost("/logout", {}, locale, token);
}

export async function sendOtp(
  phone: string,
  locale?: Locale,
  nationalId?: string,
) {
  const body: Record<string, string> = { phone };
  if (nationalId) body.national_id = nationalId;
  return apiPost("/members/otp/send", body, locale);
}

export async function verifyOtp(phone: string, code: string, locale?: Locale) {
  return apiPost("/members/otp/verify", { phone, code }, locale);
}

export async function resetPassword(
  payload: {
    password: string;
    password_confirmation: string;
    national_id: string;
  },
  locale?: Locale,
) {
  return apiPost("/members/reset-password", payload, locale);
}

const PLAYER_ID_KEY = "elsh3aby_player_id";

export function getWebPlayerId(): string {
  if (typeof window === "undefined") return "web";
  const existing = localStorage.getItem(PLAYER_ID_KEY);
  if (existing) return existing;
  const value =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `web_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(PLAYER_ID_KEY, value);
  return value;
}
