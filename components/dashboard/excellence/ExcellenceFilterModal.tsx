"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import Select, {
  components,
  type DropdownIndicatorProps,
  type StylesConfig,
} from "react-select";
import { CalendarDays, ChevronDown } from "lucide-react";
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
  yearOptions: Option[];
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
  yearOptions,
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
  const [year, setYear] = useState<Option | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setBranch(branchOptions.find((o) => o.value === values.branch) ?? null);
    setAgeGroup(ageOptions.find((o) => o.value === values.ageGroup) ?? null);
    setYear(yearOptions.find((o) => o.value === values.year) ?? null);

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
  }, [open, onClose, values, branchOptions, ageOptions, yearOptions]);

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
        className="relative z-10 w-full max-w-[440px] rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(25,33,61,0.2)] sm:p-8"
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
              onChange={(option) => setBranch(option)}
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
              onChange={(option) => setAgeGroup(option)}
              placeholder={ageLabel}
              isSearchable={false}
              isRtl={isAr}
              styles={selectStyles}
              components={{ DropdownIndicator }}
            />
          </label>

          <label className={fieldGap}>
            <span className={labelClass}>{yearLabel}</span>
            <div className="relative">
              <Select<Option, false>
                inputId={yearId}
                instanceId={yearId}
                options={yearOptions}
                value={year}
                onChange={(option) => setYear(option)}
                placeholder={yearLabel}
                isSearchable={false}
                isRtl={isAr}
                styles={selectStyles}
                components={{
                  DropdownIndicator: (props) => (
                    <components.DropdownIndicator {...props}>
                      <CalendarDays
                        className="h-4 w-4 text-[#170F49]"
                        strokeWidth={2}
                      />
                    </components.DropdownIndicator>
                  ),
                }}
              />
            </div>
          </label>
        </div>

        <button
          type="button"
          onClick={() =>
            onApply({
              branch: branch?.value ?? "",
              ageGroup: ageGroup?.value ?? "",
              year: year?.value ?? "",
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
