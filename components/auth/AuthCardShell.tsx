import type { Locale } from "@/lib/i18n/config";
import type { ReactNode } from "react";

type AuthCardShellProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  children: ReactNode;
  titleAlign?: "start" | "center";
};

const TEXT = "#170F49";
const CARD_SHADOW = "0px 23px 50px 0px rgba(25, 33, 61, 0.07)";

export function AuthCardShell({
  locale,
  title,
  subtitle,
  children,
  titleAlign = "start",
}: AuthCardShellProps) {
  const isAr = locale === "ar";

  return (
    <div className="flex min-h-dvh w-full flex-1 items-center justify-center bg-white px-4 py-8 sm:px-6 sm:py-12">
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="w-full max-w-[480px] rounded-[20px] bg-white px-6 py-8 sm:max-w-[520px] sm:px-10 sm:py-10"
        style={{ color: TEXT, boxShadow: CARD_SHADOW }}
      >
        <div
          className={`mb-6 sm:mb-8 ${
            titleAlign === "center" ? "text-center" : "text-start"
          }`}
        >
          <h1 className="text-[22px] font-bold leading-tight sm:text-[26px] lg:text-[28px]">
            {title}
          </h1>
          <p
            className={`mt-3 text-[13px] font-normal leading-7 text-[#170F49]/70 sm:text-[14px] sm:leading-8 ${
              titleAlign === "center" ? "mx-auto max-w-[400px]" : ""
            }`}
          >
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
