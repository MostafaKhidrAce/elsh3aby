"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { IdCard, Phone } from "lucide-react";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import { getApiErrorMessage, sendOtp } from "@/lib/api/auth";
import { toApiPhone } from "@/lib/api/localized";
import { savePasswordResetState } from "@/lib/auth/reset-flow";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type ForgetPasswordFormProps = {
  dictionary: Dictionary;
};

const TEXT = "#170F49";
const GOLD = "#D5AF34";
const INPUT_SHADOW = "0px 2px 6px 0px rgba(74, 58, 255, 0.1)";

function SaudiFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect width="24" height="16" rx="1.5" fill="#006C35" />
      <path
        fill="#fff"
        d="M5.2 6.2c1.4-.9 3-.9 4.2 0 .4.3.7.7.9 1.1.2-.4.5-.8.9-1.1 1.2-.9 2.8-.9 4.2 0 .2.1.3.4.2.6-.1.2-.4.3-.6.2-1.1-.7-2.4-.7-3.4 0-.5.3-.8.8-.9 1.3h1.5c.2 0 .4.2.4.4s-.2.4-.4.4H9.1c-.1.4-.4.8-.8 1.1l.7.7c.2.2.2.4 0 .6-.2.2-.4.2-.6 0l-.8-.8-.8.8c-.2.2-.4.2-.6 0-.2-.2-.2-.4 0-.6l.7-.7c-.4-.3-.7-.7-.8-1.1H4.8c-.2 0-.4-.2-.4-.4s.2-.4.4-.4h1.5c-.1-.5-.4-1-.9-1.3-1-.7-2.3-.7-3.4 0-.2.1-.5 0-.6-.2-.1-.2 0-.5.2-.6z"
      />
      <rect x="17.2" y="5.2" width="1.2" height="5.6" rx="0.4" fill="#fff" />
    </svg>
  );
}

export function ForgetPasswordForm({ dictionary }: ForgetPasswordFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;
  const isAr = locale === "ar";
  const t = dictionary.auth;
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const apiPhone = toApiPhone(phone);
    const id = nationalId.trim();
    if (!apiPhone || !id) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await sendOtp(apiPhone, locale, id);
      savePasswordResetState({ phone: apiPhone, national_id: id });
      const query = new URLSearchParams({
        phone: apiPhone,
        national_id: id,
      });
      router.push(`/${locale}/forget-password/otp?${query.toString()}`);
    } catch (err) {
      setError(getApiErrorMessage(err, t.errorGeneric));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCardShell
      locale={locale}
      title={t.forgetTitle}
      subtitle={t.forgetSubtitle}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold" style={{ color: TEXT }}>
            {t.phone}
          </span>
          <div dir="ltr" className="flex min-w-0 gap-2">
            <div
              className="flex h-12 shrink-0 items-center gap-1.5 rounded-[12px] border border-[#D5AF34] bg-white px-2.5 sm:h-14 sm:px-3"
              style={{ boxShadow: INPUT_SHADOW }}
            >
              <SaudiFlag className="h-3.5 w-5" />
              <span
                className="text-[13px] font-medium whitespace-nowrap"
                style={{ color: TEXT }}
              >
                {t.countryCode}
              </span>
            </div>
            <div className="relative min-w-0 flex-1">
              <Phone
                className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]"
                strokeWidth={1.75}
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                type="tel"
                inputMode="tel"
                placeholder={t.phonePlaceholder}
                className="h-12 w-full rounded-[12px] border border-[#D5AF34] bg-white pl-12 pr-4 text-left text-[14px] font-medium outline-none placeholder:font-normal placeholder:text-[#9CA3AF] sm:h-14 sm:text-[15px]"
                style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
              />
            </div>
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold" style={{ color: TEXT }}>
            {t.nationalId}
          </span>
          <div className="relative">
            <IdCard
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
              className={`h-12 w-full rounded-[12px] border border-[#D5AF34] bg-white pl-12 pr-4 text-[14px] font-medium outline-none placeholder:font-normal placeholder:text-[#9CA3AF] sm:h-14 sm:text-[15px] ${
                isAr ? "text-right" : "text-left"
              }`}
              style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
            />
          </div>
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          dir="ltr"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] text-[15px] font-bold transition hover:brightness-105 disabled:opacity-60 sm:h-14 sm:text-[16px]"
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
              <span>{loading ? dictionary.common.loading : t.sendCode}</span>
            </>
          ) : (
            <>
              <span>{loading ? dictionary.common.loading : t.sendCode}</span>
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

        <Link
          href={`/${locale}/login`}
          dir="ltr"
          className="inline-flex items-center justify-center gap-2 text-[13px] font-medium hover:underline sm:text-[14px]"
          style={{ color: TEXT }}
        >
          {isAr ? (
            <>
              <Image
                src="/arrows/green-left-arrow.svg"
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5"
              />
              <span>{t.backToLogin}</span>
            </>
          ) : (
            <>
              <span>{t.backToLogin}</span>
              <Image
                src="/arrows/green-left-arrow.svg"
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5 -scale-x-100"
              />
            </>
          )}
        </Link>
      </form>
    </AuthCardShell>
  );
}
