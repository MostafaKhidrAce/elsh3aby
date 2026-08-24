"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Lock, Mail } from "lucide-react";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import {
  extractAuthToken,
  getApiErrorMessage,
  loginMember,
  toAuthUser,
} from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/auth-context";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type LoginFormProps = {
  dictionary: Dictionary;
};

const TEXT = "#170F49";
const GOLD = "#D5AF34";
const BORDER = "#D5AF34";
const INPUT_SHADOW = "0px 2px 6px 0px rgba(74, 58, 255, 0.1)";

const inputClassName =
  "h-12 w-full rounded-[12px] border border-[#D5AF34] bg-white text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] sm:h-14 sm:text-[15px]";

const inputStyle = {
  borderColor: BORDER,
  color: TEXT,
  boxShadow: INPUT_SHADOW,
} as const;

export function LoginForm({ dictionary }: LoginFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;
  const isAr = locale === "ar";
  const { login } = useAuth();
  const t = dictionary.auth;
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = await loginMember(nationalId.trim(), password, locale);
      const token = extractAuthToken(payload);
      if (!token) {
        setError(t.errorGeneric);
        return;
      }
      login(
        toAuthUser(payload, {
          name: dictionary.nav.defaultMemberName,
          emailOrPhone: nationalId.trim(),
          avatarUrl: null,
        }),
        token,
      );
      router.push(`/${locale}/home`);
    } catch (err) {
      setError(getApiErrorMessage(err, t.errorGeneric));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormShell
      locale={locale}
      title={t.loginTitle}
      subtitle={t.loginSubtitle}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold" style={{ color: TEXT }}>
            {t.nationalId}
          </span>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]"
              strokeWidth={1.75}
            />
            <input
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              required
              inputMode="numeric"
              placeholder={t.nationalIdPlaceholder}
              dir="ltr"
              className={`${inputClassName} pl-12 pr-4 ${
                isAr ? "text-right" : "text-left"
              }`}
              style={inputStyle}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold" style={{ color: TEXT }}>
            {t.password}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 left-3 z-10 -translate-y-1/2 p-1 text-[#9CA3AF] hover:text-[#170F49]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Lock className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t.passwordPlaceholder}
              className={`${inputClassName} pl-12 pr-4`}
              style={inputStyle}
            />
          </div>
        </label>

        <div className={isAr ? "text-start" : "text-end"}>
          <Link
            href={`/${locale}/forget-password`}
            className="text-[13px] font-medium hover:underline sm:text-[14px]"
            style={{ color: TEXT }}
          >
            {t.forgotPassword}
          </Link>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          dir="ltr"
          disabled={loading}
          className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] text-[15px] font-bold transition hover:brightness-105 disabled:opacity-60 sm:h-14 sm:text-[16px]"
          style={{ backgroundColor: GOLD, color: TEXT }}
        >
          {isAr ? (
            <>
              <Image
                src="/arrows/green-left-arrow.svg"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
              />
              <span>{loading ? dictionary.common.loading : t.login}</span>
            </>
          ) : (
            <>
              <span>{loading ? dictionary.common.loading : t.login}</span>
              <Image
                src="/arrows/green-left-arrow.svg"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 -scale-x-100"
              />
            </>
          )}
        </button>

        <p className="text-center text-[13px] sm:text-[14px]" style={{ color: TEXT }}>
          {t.noAccount}{" "}
          <Link
            href={`/${locale}/signup`}
            className="font-bold hover:underline"
            style={{ color: "#133D3C" }}
          >
            {t.registerNow}
          </Link>
        </p>
      </form>
    </AuthFormShell>
  );
}
