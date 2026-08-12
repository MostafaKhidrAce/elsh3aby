"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n/config";

type SignupSuccessModalProps = {
  locale: Locale;
  title: string;
  description: string;
  loginLabel: string;
};

const CHECK_SRC = "/logos/check%20done.svg";
const TEXT = "#170F49";
const GOLD = "#D5AF34";

export function SignupSuccessModal({
  locale,
  title,
  description,
  loginLabel,
}: SignupSuccessModalProps) {
  const isAr = locale === "ar";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-success-title"
    >
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="flex w-[min(100%,480px)] flex-col items-center rounded-[30px] bg-white px-8 pb-8 pt-10 text-center sm:w-[520px] sm:rounded-[32px] sm:px-12 sm:pb-10 sm:pt-12"
        style={{ boxShadow: "0px 23px 50px 0px rgba(25, 33, 61, 0.07)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CHECK_SRC}
          alt=""
          width={96}
          height={96}
          className="h-24 w-24 object-contain sm:h-[96px] sm:w-[96px]"
          draggable={false}
        />

        <h2
          id="signup-success-title"
          className="mt-7 max-w-[380px] text-balance text-[21px] font-bold leading-[1.5] tracking-tight sm:mt-8 sm:max-w-[420px] sm:text-[23px]"
          style={{ color: TEXT }}
        >
          {title}
        </h2>

        <p className="mt-3.5 max-w-[400px] text-pretty text-[13.5px] font-normal leading-[1.9] text-[#9A9A9A] sm:mt-4 sm:text-[14px]">
          {description}
        </p>

        <Link
          href={`/${locale}/login`}
          dir="ltr"
          className="mt-8 inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-full text-[16px] font-bold transition hover:brightness-105 sm:mt-9 sm:h-[54px] sm:text-[17px]"
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
              <span>{loginLabel}</span>
            </>
          ) : (
            <>
              <span>{loginLabel}</span>
              <Image
                src="/arrows/green-left-arrow.svg"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 -scale-x-100"
              />
            </>
          )}
        </Link>
      </div>
    </div>,
    document.body,
  );
}
