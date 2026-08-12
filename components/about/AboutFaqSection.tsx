"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type AboutFaqSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const TEXT = "#133D3C";
const ACTIVE_TITLE = "#FCB900";

export function AboutFaqSection({ dictionary }: AboutFaqSectionProps) {
  const t = dictionary.about.faqSection;
  const [openIndex, setOpenIndex] = useState(1);

  const rightColumn = t.items
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => index % 2 === 0);
  const leftColumn = t.items
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => index % 2 === 1);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? -1 : index));
  }

  function renderCard(item: (typeof t.items)[number], index: number) {
    const isOpen = openIndex === index;

    return (
      <div
        key={`${item.question}-${index}`}
        className="w-full rounded-[16px]"
        style={{
          backgroundColor: isOpen ? "#E7EEED" : "#F6EFE7",
        }}
      >
        <button
          type="button"
          onClick={() => toggle(index)}
          aria-expanded={isOpen}
          className="flex w-full items-start gap-3 px-3 py-3.5 text-start sm:gap-4 sm:px-5 sm:py-5"
        >
          <span
            className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white sm:h-9 sm:w-9"
            style={{
              backgroundColor: isOpen ? ACTIVE_TITLE : TEXT,
            }}
          >
            {isOpen ? (
              <Minus className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            )}
          </span>

          <span className="min-w-0 flex-1">
            <span
              className="block text-[15px] font-semibold leading-7 sm:text-[17px] lg:text-[20px]"
              style={{ color: isOpen ? ACTIVE_TITLE : TEXT }}
            >
              {item.question}
            </span>

            {isOpen ? (
              <span
                className="mt-2.5 block text-[15px] font-semibold leading-7 sm:mt-3 sm:text-[17px] lg:text-[20px]"
                style={{ color: TEXT }}
              >
                {item.answer}
              </span>
            ) : null}
          </span>
        </button>
      </div>
    );
  }

  return (
    <section
      id="about-faq-section"
      className="max-w-full overflow-hidden rounded-[20px] bg-white px-3 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl xl:max-w-[1400px]">
        <h2
          className="text-center text-[24px] font-bold leading-tight sm:text-[32px] lg:text-[45px]"
          style={{ color: TEXT }}
        >
          {t.title}
        </h2>

        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-4 lg:mt-12 lg:flex-row lg:items-start lg:gap-6">
          <div className="flex w-full flex-col gap-3 sm:gap-4 lg:w-1/2 lg:gap-6">
            {rightColumn.map(({ item, index }) => renderCard(item, index))}
          </div>
          <div className="flex w-full flex-col gap-3 sm:gap-4 lg:w-1/2 lg:gap-6">
            {leftColumn.map(({ item, index }) => renderCard(item, index))}
          </div>
        </div>
      </div>
    </section>
  );
}
