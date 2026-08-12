import type { Locale } from "@/lib/i18n/config";

type AuthFormShellProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  wide?: boolean;
};

const TEXT = "#170F49";
const AUTH_BG = "/backgrounds/auth-bg.svg";

export function AuthFormShell({
  locale,
  title,
  subtitle,
  children,
}: AuthFormShellProps) {
  const isAr = locale === "ar";

  return (
    <div className="flex min-h-dvh w-full flex-1 bg-white">
      <div
        className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2"
        dir="ltr"
      >
        <aside className="relative m-3 min-h-[220px] overflow-hidden rounded-[20px] sm:m-4 sm:min-h-[280px] lg:m-5 lg:min-h-[calc(100dvh-2.5rem)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AUTH_BG}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </aside>

        <div
          dir={isAr ? "rtl" : "ltr"}
          className="flex min-w-0 flex-col justify-center bg-white px-5 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16 xl:px-20"
          style={{ color: TEXT }}
        >
          <div className="mx-auto w-full max-w-xl">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-[24px] font-bold leading-tight sm:text-[28px] lg:text-[32px]">
                {title}
              </h1>
              <p className="mt-2 text-[14px] font-normal leading-7 text-[#170F49]/80 sm:text-[15px]">
                {subtitle}
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
