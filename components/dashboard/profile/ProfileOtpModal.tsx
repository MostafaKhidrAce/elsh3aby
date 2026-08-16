"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n/config";

type ProfileOtpModalProps = {
  locale: Locale;
  title: string;
  description: string;
  resendLabel: string;
  confirmLabel: string;
  onConfirm: (code: string) => void;
  onClose: () => void;
};

export function ProfileOtpModal({
  locale,
  title,
  description,
  resendLabel,
  confirmLabel,
  onConfirm,
  onClose,
}: ProfileOtpModalProps) {
  const isAr = locale === "ar";
  const [mounted, setMounted] = useState(false);
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(20);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [seconds]);

  function updateDigit(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < 3) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  if (!mounted) return null;

  const timer = `00:${String(seconds).padStart(2, "0")}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-otp-title"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="relative z-10 flex w-[min(100%,440px)] flex-col items-center rounded-[30px] bg-white px-8 pb-8 pt-10 text-center sm:rounded-[32px] sm:px-10"
        style={{ boxShadow: "0px 23px 50px 0px rgba(25, 33, 61, 0.07)" }}
      >
        <h2
          id="profile-otp-title"
          className="text-[21px] font-bold text-[#170F49] sm:text-[23px]"
        >
          {title}
        </h2>
        <p className="mt-3 max-w-[340px] text-[13.5px] leading-[1.9] text-[#9A9A9A]">
          {description}
        </p>

        <div className="mt-7 flex items-center justify-center gap-3" dir="ltr">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onFocus={() => setFocusedIndex(index)}
              onChange={(e) => updateDigit(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e.key)}
              className={`h-14 w-14 rounded-full border bg-white text-center text-lg font-bold text-[#170F49] outline-none transition ${
                focusedIndex === index || digit
                  ? "border-[#D5AF34]"
                  : "border-[#E5E5E5]"
              }`}
            />
          ))}
        </div>

        <p className="mt-5 text-base font-bold text-[#170F49]">{timer}</p>
        <button
          type="button"
          onClick={() => setSeconds(20)}
          className="mt-2 text-sm font-semibold text-[#D5AF34]"
        >
          {resendLabel}
        </button>

        <button
          type="button"
          onClick={() => onConfirm(digits.join(""))}
          className="mt-8 inline-flex h-[50px] w-full items-center justify-center rounded-full bg-[#D5AF34] text-[16px] font-bold text-[#170F49] transition hover:brightness-105 sm:h-[54px]"
        >
          {confirmLabel}
        </button>
      </div>
    </div>,
    document.body,
  );
}
