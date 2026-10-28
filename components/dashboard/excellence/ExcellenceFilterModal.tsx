"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Select, {
  components,
  type DropdownIndicatorProps,
  type StylesConfig,
} from "react-select";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { parseDateKey, toDateKey } from "@/lib/dashboard/dummy-events";
import type { Locale } from "@/lib/i18n/config";

type Option = { value: string; label: string };

export type ExcellenceFilterValues = {
  branch: string;
  ageGroup: string;
  year: string;
};

type ExcellenceFilterModalProps = {
  open: boolean;
  locale: Locale;
  title: string;
  branchLabel: string;
  ageLabel: string;
  yearLabel: string;
  showResultsLabel: string;
  branchOptions: Option[];
  ageOptions: Option[];
  weekdays: string[];
  months: string[];
  values: ExcellenceFilterValues;
  onClose: () => void;
  onApply: (values: ExcellenceFilterValues) => void;
};

const TEXT = "#170F49";
const BORDER = "#E5E5E5";

function DropdownIndicator(props: DropdownIndicatorProps<Option, false>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 text-[#170F49]" strokeWidth={2} />
    </components.DropdownIndicator>
  );
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildMonthCells(viewMonth: Date): (Date | null)[] {
  const first = startOfMonth(viewMonth);
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

function formatDateDisplay(value: string) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [year, month, day] = value.slice(0, 10).split("-");
    return `${day}-${month}-${year}`;
  }
  return value;
}

function dateFromFilterYear(value: string) {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return parseDateKey(value.slice(0, 10));
  if (/^\d{4}$/.test(value)) return new Date(Number(value), 0, 1);
  return new Date();
}

export function ExcellenceFilterModal({
  open,
  locale,
  title,
  branchLabel,
  ageLabel,
  yearLabel,
  showResultsLabel,
  branchOptions,
  ageOptions,
  weekdays,
  months,
  values,
  onClose,
  onApply,
}: ExcellenceFilterModalProps) {
  const isAr = locale === "ar";
  const branchId = useId();
  const ageId = useId();
  const yearId = useId();
  const [mounted, setMounted] = useState(false);
  const [branch, setBranch] = useState<Option | null>(null);
  const [ageGroup, setAgeGroup] = useState<Option | null>(null);
  const [year, setYear] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setBranch(branchOptions.find((o) => o.value === values.branch) ?? null);
    setAgeGroup(ageOptions.find((o) => o.value === values.ageGroup) ?? null);
    setYear(values.year);
    setCalendarOpen(false);
    setViewMonth(startOfMonth(dateFromFilterYear(values.year)));

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
  }, [open, onClose, values, branchOptions, ageOptions]);

  const cells = useMemo(() => buildMonthCells(viewMonth), [viewMonth]);
  const monthLabel = `${months[viewMonth.getMonth()] ?? ""} ${viewMonth.getFullYear()}`;
  const selectedDate = /^\d{4}-\d{2}-\d{2}/.test(year) ? year.slice(0, 10) : "";

  function shiftMonth(delta: number) {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1));
  }

  if (!mounted || !open) return null;

  const selectStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: BORDER,
      boxShadow: "none",
      backgroundColor: "#fff",
      "&:hover": { borderColor: BORDER },
      ...(state.isFocused
        ? { borderColor: "#D5AF34", boxShadow: "none" }
        : {}),
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9CA3AF",
      fontWeight: 400,
      fontSize: 14,
    }),
    singleValue: (base) => ({
      ...base,
      color: TEXT,
      fontWeight: 500,
      fontSize: 14,
    }),
    indicatorSeparator: () => ({ display: "none" }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      overflow: "hidden",
      zIndex: 40,
    }),
    option: (base, state) => ({
      ...base,
      fontWeight: 500,
      fontSize: 14,
      color: TEXT,
      backgroundColor: state.isSelected
        ? "#F6EFE7"
        : state.isFocused
          ? "#FBF7F2"
          : "#fff",
      cursor: "pointer",
    }),
  };

  const fieldGap = "flex flex-col gap-1.5";
  const labelClass = "text-sm font-bold text-[#170F49]";

  return createPortal(
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        dir={isAr ? "rtl" : "ltr"}
        role="dialog"
        aria-modal="true"
        aria-labelledby="excellence-filter-title"
        className="relative z-10 max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(25,33,61,0.2)] sm:p-8"
      >
        <h2
          id="excellence-filter-title"
          className="mb-6 text-center text-lg font-bold text-[#170F49] sm:text-xl"
        >
          {title}
        </h2>

        <div className="space-y-4">
          <label className={fieldGap}>
            <span className={labelClass}>{branchLabel}</span>
            <Select<Option, false>
              inputId={branchId}
              instanceId={branchId}
              options={branchOptions}
              value={branch}
              onChange={(option) => {
                setCalendarOpen(false);
                setBranch(option);
              }}
              placeholder={branchLabel}
              isSearchable={false}
              isRtl={isAr}
              styles={selectStyles}
              components={{ DropdownIndicator }}
            />
          </label>

          <label className={fieldGap}>
            <span className={labelClass}>{ageLabel}</span>
            <Select<Option, false>
              inputId={ageId}
              instanceId={ageId}
              options={ageOptions}
              value={ageGroup}
              onChange={(option) => {
                setCalendarOpen(false);
                setAgeGroup(option);
              }}
              placeholder={ageLabel}
              isSearchable={false}
              isRtl={isAr}
              styles={selectStyles}
              components={{ DropdownIndicator }}
            />
          </label>

          <div className={fieldGap}>
            <span className={labelClass}>{yearLabel}</span>
            <button
              type="button"
              id={yearId}
              onClick={() => setCalendarOpen((isOpen) => !isOpen)}
              className="relative flex h-[50px] w-full items-center rounded-[12px] border border-[#E5E5E5] bg-white px-4 text-start text-sm font-medium text-[#170F49] outline-none transition hover:border-[#D5AF34] focus:border-[#D5AF34]"
            >
              <span className={year ? "text-[#170F49]" : "text-[#9CA3AF] font-normal"}>
                {formatDateDisplay(year) || yearLabel}
              </span>
              <CalendarDays
                className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#170F49] start-auto end-4"
                strokeWidth={2}
              />
            </button>

            {calendarOpen ? (
              <div className="rounded-[16px] border border-[#EFEFEF] bg-white p-3 shadow-[0_8px_24px_rgba(25,33,61,0.08)]">
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
                      return <span key={`empty-${index}`} className="h-9" />;
                    }
                    const key = toDateKey(date);
                    const isSelected = key === selectedDate;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setYear(key);
                          setCalendarOpen(false);
                        }}
                        className={`inline-flex h-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                          isSelected
                            ? "bg-[#D5AF34] text-white"
                            : "text-[#170F49] hover:bg-[#FBF3D8]"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onApply({
              branch: branch?.value ?? "",
              ageGroup: ageGroup?.value ?? "",
              year,
            })
          }
          className="mt-7 inline-flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#D5AF34] text-base font-bold text-[#170F49] transition hover:brightness-95"
        >
          {showResultsLabel}
        </button>
      </div>
    </div>,
    document.body,
  );
}
