"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n/config";

type BookingConfirmModalProps = {
  locale: Locale;
  title: string;
  description: string;
  icon: ReactNode;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  onClose?: () => void;
};

export function BookingConfirmModal({
  locale,
  title,
  description,
  icon,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
}: BookingConfirmModalProps) {
  const isAr = locale === "ar";
  const [mounted, setMounted] = useState(false);
  const close = onClose ?? onSecondary;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [close]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-confirm-title"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={close}
      />
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="relative z-10 flex w-[min(100%,480px)] flex-col items-center rounded-[30px] bg-white px-8 pb-8 pt-10 text-center sm:w-[520px] sm:rounded-[32px] sm:px-12 sm:pb-10 sm:pt-12"
        style={{ boxShadow: "0px 23px 50px 0px rgba(25, 33, 61, 0.07)" }}
      >
        <div className="flex items-center justify-center">{icon}</div>

        <h2
          id="booking-confirm-title"
          className="mt-7 max-w-[380px] text-balance text-[21px] font-bold leading-[1.5] text-[#170F49] sm:mt-8 sm:text-[23px]"
        >
          {title}
        </h2>

        <p className="mt-3.5 max-w-[400px] text-pretty text-[13.5px] leading-[1.9] text-[#9A9A9A] sm:text-[14px]">
          {description}
        </p>

        <div className="mt-8 flex w-full flex-col-reverse gap-3 sm:mt-9 sm:flex-row">
          <button
            type="button"
            onClick={onPrimary}
            className="inline-flex h-[50px] flex-1 items-center justify-center rounded-[12px] bg-[#D5AF34] text-[15px] font-bold text-[#170F49] transition hover:brightness-95 sm:h-[54px]"
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            onClick={onSecondary}
            className="inline-flex h-[50px] flex-1 items-center justify-center rounded-[12px] bg-[#F0F0F0] text-[15px] font-bold text-[#133D3C] transition hover:brightness-95 sm:h-[54px]"
          >
            {secondaryLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
