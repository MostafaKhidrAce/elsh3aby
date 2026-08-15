"use client";

import type { RequestCategory } from "@/lib/dashboard/dummy-requests";

type FilterItem = {
  id: RequestCategory;
  label: string;
  count: number;
};

type RequestCategoryFiltersProps = {
  filters: FilterItem[];
  active: RequestCategory;
  onChange: (id: RequestCategory) => void;
};

export function RequestCategoryFilters({
  filters,
  active,
  onChange,
}: RequestCategoryFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
      {filters.map((filter) => {
        const isActive = active === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`relative inline-flex items-center rounded-[10px] px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
              isActive
                ? "bg-[#133D3C] text-white shadow-[0_6px_16px_rgba(19,61,60,0.22)]"
                : "bg-[#F6F1E8] text-[#133D3C] hover:bg-[#EEE7DA]"
            }`}
          >
            {filter.label}
            <span className="absolute -top-1.5 -end-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white">
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
