"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { AboutTeaserView } from "@/lib/api/website-view";
import { websiteAboutHref } from "@/lib/api/website-routes";

type AboutSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
  data: AboutTeaserView;
};

export function AboutSection({ locale, dictionary, data }: AboutSectionProps) {
  const t = dictionary.home.aboutSection;
  const isAr = locale === "ar";

  return (
    <section
      id="about-section"
      className="relative overflow-hidden rounded-[1.25rem] bg-white sm:rounded-[1.75rem]"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-6 px-3 py-8 sm:gap-8 sm:px-5 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-20 xl:max-w-[1400px] xl:gap-20 xl:px-16">
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
          <p className="text-sm font-medium text-green-dark lg:text-base">
            {data.eyebrow}
          </p>
          <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-snug text-green-dark sm:mt-3 sm:text-3xl lg:text-[2.75rem] lg:leading-[1.25]">
            {data.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-muted sm:mt-4 sm:text-base sm:leading-8 lg:mt-5 lg:text-lg lg:leading-9">
            {data.body}
          </p>

          {data.email || data.phone ? (
          <div className="mt-6 flex flex-col gap-4 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-start sm:gap-6 lg:mt-8 lg:gap-8">
            {data.email ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-dark/25 text-green-dark lg:h-12 lg:w-12">
                <Mail className="h-4 w-4 lg:h-5 lg:w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <p className="text-xs text-muted sm:text-sm">{t.emailLabel}</p>
                <a
                  href={`mailto:${data.email}`}
                  className="text-sm font-bold text-green-dark hover:text-gold lg:text-base"
                >
                  {data.email}
                </a>
              </div>
            </div>
            ) : null}

            {data.phone ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-dark/25 text-green-dark lg:h-12 lg:w-12">
                <Phone className="h-4 w-4 lg:h-5 lg:w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <p className="text-xs text-muted sm:text-sm">{t.phoneLabel}</p>
                <a
                  href={`tel:${data.phone.replace(/-/g, "")}`}
                  className="text-sm font-bold text-green-dark hover:text-gold lg:text-base"
                  dir="ltr"
                >
                  {data.phone}
                </a>
              </div>
            </div>
            ) : null}
          </div>
          ) : null}

          <div className="mt-6 lg:mt-8">
            <Link
              href={websiteAboutHref(locale)}
              dir="ltr"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-green-dark transition hover:brightness-105 lg:px-5 lg:py-3"
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
                  <span>{data.cta}</span>
                </>
              ) : (
                <>
                  <span>{data.cta}</span>
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
