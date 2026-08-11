"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type AboutSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function AboutSection({ locale, dictionary }: AboutSectionProps) {
  const t = dictionary.home.aboutSection;
  const isAr = locale === "ar";

  return (
    <section
      id="about-section"
      className="relative overflow-hidden rounded-[1.25rem] bg-white sm:rounded-[1.75rem]"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-20 xl:max-w-[1400px] xl:gap-20 xl:px-16">
        <div className={`order-1 ${isAr ? "lg:order-2" : "lg:order-1"}`}>
          <Image
            src="/backgrounds/about-section-bg.svg"
            alt=""
            width={582}
            height={621}
            className="mx-auto h-auto w-full max-w-[620px] object-contain xl:max-w-[680px]"
            priority={false}
          />
        </div>

        <div
          className={`order-2 flex flex-col ${
            isAr ? "lg:order-1 text-start" : "lg:order-2 text-start"
          }`}
        >
          <p className="text-base font-medium text-green-dark">{t.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-snug text-green-dark sm:text-4xl lg:text-[2.75rem] lg:leading-[1.25]">
            {t.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-muted sm:text-lg sm:leading-9">
            {t.body}
          </p>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:gap-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-green-dark/25 text-green-dark">
                <Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <p className="text-sm text-muted">{t.emailLabel}</p>
                <a
                  href={`mailto:${t.email}`}
                  className="text-base font-bold text-green-dark hover:text-gold"
                >
                  {t.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-green-dark/25 text-green-dark">
                <Phone className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <p className="text-sm text-muted">{t.phoneLabel}</p>
                <a
                  href={`tel:${t.phone.replace(/-/g, "")}`}
                  className="text-base font-bold text-green-dark hover:text-gold"
                  dir="ltr"
                >
                  {t.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href={`/${locale}/home/about`}
              dir="ltr"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-semibold text-green-dark transition hover:brightness-105"
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
                  <span>{t.cta}</span>
                </>
              ) : (
                <>
                  <span>{t.cta}</span>
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
        </div>
      </div>
    </section>
  );
}
