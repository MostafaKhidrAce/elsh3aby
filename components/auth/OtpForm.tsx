"use client";

import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent,
  ClipboardEvent,
  useRef,
  useState,
} from "react";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type OtpFormProps = {
  dictionary: Dictionary;
};

const TEXT = "#170F49";
const GOLD = "#D5AF34";
const INPUT_SHADOW = "0px 2px 6px 0px rgba(74, 58, 255, 0.1)";
const OTP_LENGTH = 6;

export function OtpForm({ dictionary }: OtpFormProps) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as Locale;
  const isAr = locale === "ar";
  const target = searchParams.get("target") ?? "";
  const t = dictionary.auth;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = digits.join("");
    if (code.length !== OTP_LENGTH) {
      setError(dictionary.common.required);
      return;
    }
    // Dummy auth: any 6-digit OTP is accepted
    console.log({ otp: code, target });
    const query = target ? `?target=${encodeURIComponent(target)}` : "";
    router.push(`/${locale}/forget-password/new-password${query}`);
  }

  function handleResend() {
    console.log({ resendOtp: true, target });
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
            {renderBox(2)}
            <span className="px-1 text-[20px] font-bold text-[#9CA3AF]">-</span>
            {renderBox(3)}
            {renderBox(4)}
            {renderBox(5)}
          </div>
        </div>

        {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}

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
              <span>{t.verify}</span>
            </>
          ) : (
            <>
              <span>{t.verify}</span>
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
          className="text-center text-[13px] font-medium hover:underline sm:text-[14px]"
          style={{ color: TEXT }}
        >
          {t.otpResend}
        </button>
      </form>
    </AuthCardShell>
  );
}
