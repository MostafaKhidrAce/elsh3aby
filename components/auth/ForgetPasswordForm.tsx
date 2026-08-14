"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type ForgetPasswordFormProps = {
  dictionary: Dictionary;
};

const TEXT = "#170F49";
const GOLD = "#D5AF34";
const INPUT_SHADOW = "0px 2px 6px 0px rgba(74, 58, 255, 0.1)";

export function ForgetPasswordForm({ dictionary }: ForgetPasswordFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;
  const isAr = locale === "ar";
  const t = dictionary.auth;
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = encodeURIComponent(email.trim());
    router.push(`/${locale}/forget-password/otp?target=${query}`);
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
            {t.email}
          </span>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]"
              strokeWidth={1.75}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t.forgetEmailPlaceholder}
              dir="ltr"
              className={`h-12 w-full rounded-[12px] border border-[#D5AF34] bg-white pl-12 pr-4 text-[14px] font-medium outline-none placeholder:font-normal placeholder:text-[#9CA3AF] sm:h-14 sm:text-[15px] ${
                isAr ? "text-right" : "text-left"
              }`}
              style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
            />
          </div>
        </label>

        <button
          type="submit"
          dir="ltr"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] text-[15px] font-bold transition hover:brightness-105 sm:h-14 sm:text-[16px]"
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
              <span>{t.sendCode}</span>
            </>
          ) : (
            <>
              <span>{t.sendCode}</span>
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
