"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n/config";

type DashboardAlertModalProps = {
  locale: Locale;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
};

const TEXT = "#170F49";
const GOLD = "#D5AF34";

export function DashboardAlertModal({
  locale,
  title,
  description,
  confirmLabel,
  onConfirm,
}: DashboardAlertModalProps) {
  const isAr = locale === "ar";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onConfirm();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onConfirm]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dashboard-alert-title"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onConfirm}
      />
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="relative z-10 flex w-[min(100%,420px)] flex-col items-center rounded-[28px] bg-white px-6 pb-6 pt-9 text-center sm:w-[460px] sm:rounded-[32px] sm:px-10 sm:pb-8 sm:pt-11"
        style={{ boxShadow: "0px 23px 50px 0px rgba(25, 33, 61, 0.07)" }}
      >
        <div
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full sm:h-20 sm:w-20"
          style={{ backgroundColor: "#F97066" }}
          aria-hidden
        >
          <span className="text-[42px] font-bold leading-none text-white sm:text-[48px]">
            !
          </span>
        </div>

        <h2
          id="dashboard-alert-title"
          className="mt-6 max-w-[380px] text-balance text-[20px] font-bold leading-[1.5] sm:mt-7 sm:text-[22px]"
          style={{ color: TEXT }}
        >
          {title}
        </h2>

        <p className="mt-3 max-w-[360px] text-pretty text-[13.5px] leading-[1.9] text-[#8A8A8A] sm:mt-3.5 sm:text-[14px]">
          {description}
        </p>

        <button
          type="button"
          onClick={onConfirm}
          className="mt-7 inline-flex h-[48px] w-full items-center justify-center rounded-[12px] text-[16px] font-bold transition hover:brightness-105 sm:mt-8 sm:h-[52px]"
          style={{ backgroundColor: GOLD, color: TEXT }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>,
    document.body,
  );
}
