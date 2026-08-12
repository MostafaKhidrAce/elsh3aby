"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HeroNav } from "@/components/layout/HeroNav";
import { AnimatedStat } from "@/components/home/AnimatedStat";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type HomeHeroProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const HERO_BACKGROUNDS = [
  "/backgrounds/hero-section-bg-1.jpg",
  "/backgrounds/hero-section-bg.svg",
  "/backgrounds/hero-section-bg-3.jpg",
] as const;

const STATS = [
  { key: "heritage" as const, value: 100 },
  { key: "news" as const, value: 500 },
  { key: "events" as const, value: 150 },
  { key: "members" as const, value: 1250 },
];

function CtaArrow({ locale, src, alt = "" }: { locale: Locale; src: string; alt?: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={16}
      height={16}
      className={`h-4 w-4 shrink-0 ${locale === "en" ? "-scale-x-100" : ""}`}
    />
  );
}

function CtaContent({
  locale,
  label,
  arrowSrc,
}: {
  locale: Locale;
  label: string;
  arrowSrc: string;
}) {
  const arrow = <CtaArrow locale={locale} src={arrowSrc} />;
  if (locale === "ar") {
    return (
      <>
        {arrow}
        <span>{label}</span>
      </>
    );
  }
  return (
    <>
      <span>{label}</span>
      {arrow}
    </>
  );
}

export function HomeHero({ locale, dictionary }: HomeHeroProps) {
  const t = dictionary.home;
  const [activeSlide, setActiveSlide] = useState(1);

  return (
    <div>
      <section className="relative overflow-hidden rounded-[1.25rem] text-white sm:rounded-[1.75rem]">
        {HERO_BACKGROUNDS.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${src})` }}
            aria-hidden
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #145452 0%, #002827 100%)",
            opacity: 0.92,
          }}
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[min(100vh,920px)] flex-col">
          <HeroNav locale={locale} dictionary={dictionary} />

          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-3 pb-5 pt-8 text-center sm:px-5 sm:pt-10 lg:px-6 lg:pb-6 lg:pt-14">
            <h1 className="max-w-4xl text-2xl font-bold leading-snug sm:text-3xl md:text-4xl lg:text-[3.25rem]">
              {t.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90 sm:mt-4 sm:text-base sm:leading-7 lg:mt-5 lg:text-lg lg:leading-8">
              {t.subtitle}
            </p>

            <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-center lg:mt-10">
              <a
                href="https://example.com/app-download"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-green-dark transition hover:brightness-105 lg:px-5 lg:py-3"
              >
                <CtaContent
                  locale={locale}
                  label={t.ctaDownload}
                  arrowSrc="/arrows/green-left-arrow.svg"
                />
              </a>
              <Link
                href={`/${locale}/signup`}
                dir="ltr"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/80 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 lg:px-5 lg:py-3"
              >
                <CtaContent
                  locale={locale}
                  label={t.ctaJoin}
                  arrowSrc="/arrows/white-left-arrow.svg"
                />
              </Link>
            </div>

            <div className="mt-8 grid w-full grid-cols-2 gap-2.5 sm:mt-12 sm:grid-cols-4 sm:gap-4 lg:mt-16 lg:gap-5">
              {STATS.map((stat) => (
                <AnimatedStat
                  key={stat.key}
                  value={stat.value}
                  label={t.stats[stat.key]}
                  moreThan={t.moreThan}
                />
              ))}
            </div>

            <a
              href="#after-hero"
              className="mt-8 inline-flex h-10 w-6 items-center justify-center rounded-full border border-white/70 transition hover:bg-white/10 lg:mt-10 lg:h-12 lg:w-7"
              aria-label="Scroll down"
            >
              <Image
                src="/arrows/white-down-arrow.svg"
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5"
              />
            </a>
          </div>
        </div>
      </section>

      <div
        className="flex items-center justify-center gap-2.5 py-4"
        role="tablist"
        aria-label="Hero background slides"
      >
        {HERO_BACKGROUNDS.map((_, index) => {
          const isActive = index === activeSlide;
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                isActive
                  ? "bg-gold"
                  : "border border-black/25 bg-transparent hover:border-gold"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
