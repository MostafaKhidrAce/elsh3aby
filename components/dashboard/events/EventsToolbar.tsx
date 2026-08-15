"use client";

import { Filter, Search } from "lucide-react";

type EventsToolbarProps = {
  allSectionsLabel: string;
  searchPlaceholder: string;
  filterLabel: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export function EventsToolbar({
  allSectionsLabel,
  searchPlaceholder,
  filterLabel,
  searchQuery,
  onSearchChange,
}: EventsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-bold text-[#133D3C] sm:text-xl">
        {allSectionsLabel}
      </h2>

      <div className="flex flex-wrap items-center gap-2.5">
        <label className="relative w-full max-w-[280px] sm:w-[260px]">
          <span className="sr-only">{searchPlaceholder}</span>
          <Search
            className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF] start-3.5"
            strokeWidth={2}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-[14px] border border-[#E8E8E8] bg-white py-2.5 pe-4 ps-11 text-sm text-[#170F49] outline-none transition placeholder:text-[#A0A0B0] focus:border-[#D5AF34]"
          />
        </label>

        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[14px] border border-[#E8E8E8] bg-white px-4 py-2.5 text-sm font-semibold text-[#133D3C] transition hover:border-[#D5AF34]/50"
        >
          <Filter className="h-4 w-4 text-[#133D3C]" strokeWidth={2} />
          {filterLabel}
        </button>
      </div>
    </div>
  );
}
