"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  parseDateKey,
  toDateKey,
} from "@/lib/dashboard/dummy-events";
import type { Locale } from "@/lib/i18n/config";

type EventsCalendarModalProps = {
  open: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  datesWithEvents: Set<string>;
  weekdays: string[];
  months: string[];
  locale: Locale;
  title: string;
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Saturday-first calendar cells for a month view. */
function buildMonthCells(viewMonth: Date): (Date | null)[] {
  const first = startOfMonth(viewMonth);
  // JS Sun=0 … Sat=6 → Sat-first offset
  const offset = (first.getDay() + 1) % 7;
  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0,
  ).getDate();

  const cells: (Date | null)[] = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function EventsCalendarModal({
  open,
  onClose,
  selectedDate,
  onSelectDate,
  datesWithEvents,
  weekdays,
  months,
  locale,
  title,
}: EventsCalendarModalProps) {
  const isAr = locale === "ar";
  const selected = parseDateKey(selectedDate);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selected));

  useEffect(() => {
    if (open) setViewMonth(startOfMonth(parseDateKey(selectedDate)));
  }, [open, selectedDate]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const cells = useMemo(() => buildMonthCells(viewMonth), [viewMonth]);
  const monthLabel = `${months[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

  if (!open) return null;

  function shiftMonth(delta: number) {
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1),
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-[360px] rounded-[20px] bg-white p-5 shadow-[0_20px_50px_rgba(25,33,61,0.2)]"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[#170F49]">{title}</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] text-[#133D3C]"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(isAr ? 1 : -1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] text-[#133D3C]"
            aria-label="Previous month"
          >
            {isAr ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
          <p className="text-sm font-bold text-[#133D3C]">{monthLabel}</p>
          <button
            type="button"
            onClick={() => shiftMonth(isAr ? -1 : 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] text-[#133D3C]"
            aria-label="Next month"
          >
            {isAr ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#9CA3AF]">
          {weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, index) => {
            if (!date) {
              return <span key={`empty-${index}`} className="h-10" />;
            }
            const key = toDateKey(date);
            const isSelected = key === selectedDate;
            const hasEvents = datesWithEvents.has(key);

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onSelectDate(key);
                  onClose();
                }}
                className={`inline-flex h-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                  isSelected
                    ? "bg-[#D5AF34] text-white"
                    : hasEvents
                      ? "border-2 border-[#D5AF34] text-[#133D3C] hover:bg-[#FBF3D8]"
                      : "text-[#170F49] hover:bg-[#F5F5F5]"
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
