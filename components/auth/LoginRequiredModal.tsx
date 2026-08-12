"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

type LoginRequiredModalProps = {
  locale: Locale;
  title: string;
  description: string;
  loginLabel: string;
  dismissible?: boolean;
  onClose?: () => void;
};

const PADLOCK_SRC = "/logos/Unlock Padlock.svg";

export function LoginRequiredModal({
  locale,
  title,
  description,
  loginLabel,
  dismissible = false,
  onClose,
}: LoginRequiredModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-required-title"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="flex w-[min(100%,480px)] flex-col items-center rounded-[30px] bg-white px-8 pb-8 pt-10 text-center shadow-[0_24px_64px_rgba(0,0,0,0.35)] sm:w-[520px] sm:rounded-[32px] sm:px-12 sm:pb-10 sm:pt-12"
        onClick={(event) => event.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PADLOCK_SRC}
          alt=""
          width={96}
          height={96}
          className="h-24 w-24 object-contain sm:h-[96px] sm:w-[96px]"
          draggable={false}
        />

        <h2
          id="login-required-title"
          className="mt-7 max-w-[380px] text-balance text-[21px] font-bold leading-[1.5] tracking-tight text-[#0F0F0F] sm:mt-8 sm:max-w-[420px] sm:text-[23px]"
        >
          {title}
        </h2>

        <p className="mt-3.5 max-w-[400px] text-pretty text-[13.5px] font-normal leading-[1.9] text-[#9A9A9A] sm:mt-4 sm:text-[14px]">
          {description}
        </p>

        <Link
          href={`/${locale}/login`}
          className="mt-8 inline-flex h-[50px] w-full items-center justify-center rounded-full bg-[#D5AF34] text-[16px] font-bold text-[#141414] transition hover:brightness-105 sm:mt-9 sm:h-[54px] sm:text-[17px]"
          onClick={onClose}
        >
          {loginLabel}
        </Link>
      </div>
    </div>
  );
}
