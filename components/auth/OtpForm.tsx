"use client";

import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent,
  ClipboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import { SignupSuccessModal } from "@/components/auth/SignupSuccessModal";
import { getApiErrorMessage, sendOtp, verifyOtp } from "@/lib/api/auth";
import {
  fromQueryPasswordResetState,
  loadPasswordResetState,
  savePasswordResetState,
} from "@/lib/auth/reset-flow";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type OtpFormProps = {
  dictionary: Dictionary;
  purpose?: "reset" | "signup";
};

const TEXT = "#170F49";
const GOLD = "#D5AF34";
const INPUT_SHADOW = "0px 2px 6px 0px rgba(74, 58, 255, 0.1)";
const OTP_LENGTH = 4;

export function OtpForm({ dictionary, purpose = "reset" }: OtpFormProps) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as Locale;
  const isAr = locale === "ar";
  const t = dictionary.auth;
  const isSignup = purpose === "signup";
  const phone = searchParams.get("phone");
  const nationalId = searchParams.get("national_id");
  const queryState = useMemo(
    () => fromQueryPasswordResetState(phone, nationalId),
    [phone, nationalId],
  );
  const [resetState, setResetState] = useState(queryState);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (queryState) {
      setResetState(queryState);
      return;
    }
    const stored = loadPasswordResetState();
    if (stored) {
      setResetState(stored);
      return;
    }
    router.replace(isSignup ? `/${locale}/signup` : `/${locale}/forget-password`);
  }, [isSignup, locale, queryState, router]);

  useEffect(() => {
    if (!successOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [successOpen]);

  function focusIndex(index: number) {
    const el = inputsRef.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  }

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });
    setError("");
    if (digit && index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      setDigits((current) => {
        const next = [...current];
        next[index - 1] = "";
        return next;
      });
      focusIndex(index - 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusIndex(Math.max(0, index - 1));
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusIndex(Math.min(OTP_LENGTH - 1, index + 1));
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    setError("");
    focusIndex(Math.min(pasted.length, OTP_LENGTH - 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resetState) return;
    const code = digits.join("");
    if (code.length !== OTP_LENGTH) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyOtp(resetState.phone, code, locale);
      if (isSignup) {
        setSuccessOpen(true);
        return;
      }
      savePasswordResetState(resetState);
      const query = new URLSearchParams({
        phone: resetState.phone,
        national_id: resetState.national_id,
      });
      router.push(`/${locale}/forget-password/new-password?${query.toString()}`);
    } catch (err) {
      setError(getApiErrorMessage(err, t.errorGeneric));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!resetState || resending) return;
    setError("");
    setResending(true);
    try {
      await sendOtp(resetState.phone, locale, resetState.national_id);
    } catch (err) {
      setError(getApiErrorMessage(err, t.errorGeneric));
    } finally {
      setResending(false);
    }
  }

  function renderBox(index: number) {
    return (
      <input
        key={index}
        ref={(el) => {
          inputsRef.current[index] = el;
        }}
        type="text"
        inputMode="numeric"
        autoComplete={index === 0 ? "one-time-code" : "off"}
        maxLength={1}
        value={digits[index]}
        onChange={(e) => updateDigit(index, e.target.value)}
        onKeyDown={(e) => handleKeyDown(index, e)}
        onPaste={handlePaste}
        aria-label={`${t.otp} ${index + 1}`}
        className="h-12 w-11 rounded-[10px] border border-[#D5AF34] bg-white text-center text-[18px] font-semibold outline-none sm:h-14 sm:w-12 sm:text-[20px]"
        style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
      />
    );
  }

  return (
    <>
    <AuthCardShell
      locale={locale}
      title={t.otpTitle}
      subtitle={t.otpSubtitle}
      titleAlign="center"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span
            className={`text-[14px] font-bold ${isAr ? "text-start" : "text-start"}`}
            style={{ color: TEXT }}
          >
            {t.otp}
          </span>

          <div dir="ltr" className="flex items-center justify-center gap-2 sm:gap-2.5">
            {renderBox(0)}
            {renderBox(1)}
            <span className="px-1 text-[20px] font-bold text-[#9CA3AF]">-</span>
            {renderBox(2)}
            {renderBox(3)}
          </div>
        </div>

        {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}

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
              <span>{loading ? dictionary.common.loading : t.verify}</span>
            </>
          ) : (
            <>
              <span>{loading ? dictionary.common.loading : t.verify}</span>
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

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-center text-[13px] font-medium hover:underline disabled:opacity-60 sm:text-[14px]"
          style={{ color: TEXT }}
        >
          {resending ? dictionary.common.loading : t.otpResend}
        </button>
      </form>
    </AuthCardShell>
    {successOpen ? (
      <SignupSuccessModal
        locale={locale}
        title={t.signupSuccess.title}
        description={t.signupSuccess.description}
        loginLabel={t.signupSuccess.login}
      />
    ) : null}
    </>
  );
}
