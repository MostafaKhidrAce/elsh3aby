"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CreditCard } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type BookingPaymentModalProps = {
  locale: Locale;
  title: string;
  description: string;
  payLabel: string;
  priceLabel: string;
  progress?: number;
  onPay: () => void;
  onClose: () => void;
};

export function BookingPaymentModal({
  locale,
  title,
  description,
  payLabel,
  priceLabel,
  progress = 0.75,
  onPay,
  onClose,
}: BookingPaymentModalProps) {
  const isAr = locale === "ar";
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) return null;

  const clamped = Math.min(1, Math.max(0, progress));

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-payment-title"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="relative z-10 w-[min(100%,480px)] rounded-[30px] bg-white px-6 pb-8 pt-8 sm:w-[520px] sm:rounded-[32px] sm:px-10 sm:pb-10 sm:pt-10"
        style={{ boxShadow: "0px 23px 50px 0px rgba(25, 33, 61, 0.07)" }}
      >
        <h2
          id="booking-payment-title"
          className="text-center text-[18px] font-bold leading-[1.6] text-[#170F49] sm:text-[20px]"
        >
          {title}
        </h2>

        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-[#EFEFEF]">
          <div
            className="h-full rounded-full bg-[#D5AF34] transition-all"
            style={{ width: `${clamped * 100}%` }}
          />
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-[16px] bg-[#FAFAFA] p-4">
          <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F6E9B8]">
            <CreditCard className="h-7 w-7 text-[#2563EB]" strokeWidth={1.75} />
          </div>
          <p className="text-start text-sm leading-7 text-[#5C5C6B]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onPay}
          className="mt-8 inline-flex h-[54px] w-full items-center justify-between rounded-[12px] bg-[#D5AF34] px-5 text-[16px] font-bold text-white transition hover:brightness-95"
        >
          <span>{payLabel}</span>
          <span>{priceLabel}</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
