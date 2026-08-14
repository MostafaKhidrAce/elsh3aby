"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import { SignupSuccessModal } from "@/components/auth/SignupSuccessModal";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type NewPasswordFormProps = {
  dictionary: Dictionary;
};

const TEXT = "#170F49";
const GOLD = "#D5AF34";
const INPUT_SHADOW = "0px 2px 6px 0px rgba(74, 58, 255, 0.1)";

export function NewPasswordForm({ dictionary }: NewPasswordFormProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const isAr = locale === "ar";
  const t = dictionary.auth;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!successOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [successOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    console.log({ passwordUpdated: true });
    setSuccessOpen(true);
  }

  return (
    <>
      <AuthCardShell
        locale={locale}
        title={t.newPasswordTitle}
        subtitle={t.newPasswordSubtitle}
        titleAlign="center"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-bold" style={{ color: TEXT }}>
              {t.newPassword}
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
                placeholder={t.newPasswordPlaceholder}
                className="h-12 w-full rounded-[12px] border border-[#D5AF34] bg-white py-2 pl-11 pr-4 text-[14px] font-medium outline-none placeholder:font-normal placeholder:text-[#9CA3AF] sm:h-14 sm:text-[15px]"
                style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-bold" style={{ color: TEXT }}>
              {t.confirmPassword}
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute top-1/2 left-3 z-10 -translate-y-1/2 p-1 text-[#9CA3AF] hover:text-[#170F49]"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                <Lock className="h-5 w-5" strokeWidth={1.75} />
              </button>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder={t.confirmPasswordPlaceholder}
                className="h-12 w-full rounded-[12px] border border-[#D5AF34] bg-white py-2 pl-11 pr-4 text-[14px] font-medium outline-none placeholder:font-normal placeholder:text-[#9CA3AF] sm:h-14 sm:text-[15px]"
                style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
              />
            </div>
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="mt-1 grid grid-cols-2 gap-3">
            <button
              type="submit"
              dir="ltr"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] text-[14px] font-bold transition hover:brightness-105 sm:h-14 sm:text-[15px]"
              style={{ backgroundColor: GOLD, color: TEXT }}
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
                  <span>{t.updatePassword}</span>
                </>
              ) : (
                <>
                  <span>{t.updatePassword}</span>
                  <Image
                    src="/arrows/green-left-arrow.svg"
                    alt=""
                    width={14}
                    height={14}
                    className="h-3.5 w-3.5 -scale-x-100"
                  />
                </>
              )}
            </button>

            <Link
              href={`/${locale}/login`}
              className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#D5AF34] bg-white text-[14px] font-bold transition hover:bg-[#FBF7F2] sm:h-14 sm:text-[15px]"
              style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
            >
              {t.login}
            </Link>
          </div>

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

      {successOpen ? (
        <SignupSuccessModal
          locale={locale}
          title={t.passwordChanged.title}
          description={t.passwordChanged.description}
          loginLabel={t.passwordChanged.login}
        />
      ) : null}
    </>
  );
}
