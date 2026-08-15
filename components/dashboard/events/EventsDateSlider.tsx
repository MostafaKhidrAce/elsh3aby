"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseDateKey } from "@/lib/dashboard/dummy-events";
import type { Locale } from "@/lib/i18n/config";

type EventsDateSliderProps = {
  dates: string[];
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  weekdays: string[];
  locale: Locale;
};

function weekdayLabel(date: Date, weekdays: string[]): string {
  const jsDay = date.getDay();
  const satFirst = (jsDay + 1) % 7;
  return weekdays[satFirst] ?? "";
}

export function EventsDateSlider({
  dates,
  selectedDate,
  onSelectDate,
  weekdays,
  locale,
}: EventsDateSliderProps) {
  const isAr = locale === "ar";
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const selected = scroller.querySelector<HTMLElement>(
      `[data-date="${selectedDate}"]`,
    );
    selected?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedDate]);

  function scrollBy(direction: "prev" | "next") {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const amount = 200;
    const delta =
      direction === "next"
        ? isAr
          ? -amount
          : amount
        : isAr
          ? amount
          : -amount;
    scroller.scrollBy({ left: delta, behavior: "smooth" });
  }

  const arrowClass =
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#133D3C] text-white transition hover:brightness-110";

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Previous dates"
        onClick={() => scrollBy("prev")}
        className={arrowClass}
      >
        {isAr ? (
          <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
        ) : (
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
        )}
      </button>

      <div
        ref={scrollerRef}
        className="flex min-w-0 flex-1 gap-2.5 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {dates.map((dateKey) => {
          const date = parseDateKey(dateKey);
          const selected = dateKey === selectedDate;
          return (
            <button
              key={dateKey}
              type="button"
              data-date={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`flex min-w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-[16px] px-3 py-3 text-center transition ${
                selected
                  ? "bg-[#133D3C] text-white shadow-[0_8px_18px_rgba(19,61,60,0.25)]"
                  : "bg-[#F6F1E8] text-[#133D3C] hover:bg-[#EEE7DA]"
              }`}
            >
              <span
                className={`text-[12px] font-medium ${
                  selected ? "text-white/85" : "text-[#133D3C]/80"
                }`}
              >
                {weekdayLabel(date, weekdays)}
              </span>
              <span className="text-[18px] font-bold leading-none">
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Next dates"
        onClick={() => scrollBy("next")}
        className={arrowClass}
      >
        {isAr ? (
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
        ) : (
          <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
}
