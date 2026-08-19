"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLoginRequired } from "@/components/auth/RouteGuard";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { NewsCardView } from "@/lib/api/website-view";

type NewsSectionProps = {
  locale: Locale;
  dictionary?: Dictionary;
  eyebrow: string;
  title: string;
  description: string;
  cards: NewsCardView[];
};

function useVisibleCount() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCount(1);
      else if (window.innerWidth < 1024) setCount(2);
      else setCount(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export function NewsSection({
  locale,
  eyebrow,
  title,
  description,
  cards,
}: NewsSectionProps) {
  const isAr = locale === "ar";
  const { isAuthenticated } = useAuth();
  const { openLoginRequired } = useLoginRequired();
  const visibleCount = useVisibleCount();
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, cards.length - visibleCount);

  function handleCardClick() {
    if (!isAuthenticated) {
      openLoginRequired();
    }
  }

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  function goPrev() {
    setIndex((current) => Math.max(0, current - 1));
  }

  function goNext() {
    setIndex((current) => Math.min(maxIndex, current + 1));
  }

  const canPrev = index > 0;
  const canNext = index < maxIndex;
  const visibleCards = cards.slice(index, index + visibleCount);

  const navBtnBase =
    "inline-flex h-10 w-[52px] items-center justify-center rounded-full border border-white transition";

  return (
    <section
      id="news-section"
      className="rounded-[20px] px-3 py-8 sm:px-5 sm:py-12 lg:px-10 lg:py-20"
      style={{ backgroundColor: "#F6EFE7" }}
    >
      <div className="mx-auto w-full max-w-7xl xl:max-w-[1400px]">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="text-[18px] font-medium leading-normal sm:text-[20px] lg:text-[24px]"
            style={{ color: "#133D3C" }}
          >
            {eyebrow}
          </p>
          <h2
            className="mt-2 text-[24px] font-bold leading-tight sm:mt-3 sm:text-[28px] md:text-[32px] lg:text-[46px]"
            style={{ color: "#133D3C" }}
          >
            {title}
          </h2>
          <p
            className="mx-auto mt-3 max-w-3xl text-[15px] font-medium leading-7 sm:mt-4 sm:text-[17px] sm:leading-8 lg:text-[20px] lg:leading-9"
            style={{ color: "#426463" }}
          >
            {description}
          </p>
        </div>

        <div
          className={`mt-6 flex gap-3 sm:mt-8 lg:mt-10 ${
            isAr ? "justify-start" : "justify-end"
          }`}
          dir="ltr"
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={!canPrev}
            aria-label="Previous"
            className={`${navBtnBase} ${
              canPrev
                ? "bg-[#133D3C] hover:brightness-110"
                : "cursor-not-allowed bg-[#133D3C]/35"
            }`}
          >
            <Image
              src="/arrows/white-left-arrow.svg"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4"
            />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext}
            aria-label="Next"
            className={`${navBtnBase} ${
              canNext
                ? "bg-[#133D3C] hover:brightness-110"
                : "cursor-not-allowed bg-[#133D3C]/35"
            }`}
          >
            <Image
              src="/arrows/white-left-arrow.svg"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 -scale-x-100"
            />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {visibleCards.map((card) => {
            return (
              <article
                key={card.id}
                className="relative min-h-[340px] overflow-hidden rounded-[20px] sm:min-h-[400px] lg:min-h-[520px] xl:min-h-[560px]"
              >
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <div className="absolute inset-x-3 bottom-4 sm:inset-x-4 sm:bottom-6 lg:inset-x-5 lg:bottom-8">
                  <button
                    type="button"
                    dir="ltr"
                    onClick={handleCardClick}
                    className="flex w-full flex-col gap-3 rounded-[20px] px-3 py-3 text-start backdrop-blur-md sm:gap-4 sm:px-4 sm:py-4"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.22)" }}
                  >
                    <span
                      className={`inline-flex h-9 w-[44px] shrink-0 items-center justify-center rounded-full border border-white ${
                        isAr ? "self-start" : "self-end"
                      }`}
                    >
                      <Image
                        src="/arrows/white-left-arrow.svg"
                        alt=""
                        width={14}
                        height={14}
                        className={`h-3.5 w-3.5 ${isAr ? "" : "-scale-x-100"}`}
                      />
                    </span>

                    <div
                      className={`min-w-0 text-white ${
                        isAr ? "self-end text-end" : "self-start text-start"
                      }`}
                    >
                      <h3 className="truncate text-[16px] font-bold sm:text-[18px]">
                        {card.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-[13px] font-medium text-white/90 sm:text-[14px]">
                        {card.description}
                      </p>
                    </div>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
