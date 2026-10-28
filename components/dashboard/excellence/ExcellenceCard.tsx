"use client";

import { useState } from "react";
import { EXCELLENCE_FALLBACK_IMAGE, isExcellencePhoto } from "@/lib/api/excellence";
import type { DummyExcellence } from "@/lib/dashboard/dummy-excellence";
import type { Locale } from "@/lib/i18n/config";

type ExcellenceCardProps = {
  item: DummyExcellence;
  locale: Locale;
  categoryLabel: string;
  showMoreLabel: string;
  onShowMore: (id: string) => void;
};

export function ExcellenceCard({
  item,
  locale,
  categoryLabel,
  showMoreLabel,
  onShowMore,
}: ExcellenceCardProps) {
  const isAr = locale === "ar";
  const name = isAr ? item.name : item.nameEn;
  const title = isAr ? item.title : item.titleEn;
  const [broken, setBroken] = useState(false);
  const showPhoto = !broken && isExcellencePhoto(item.image);

  return (
    <article className="flex h-full flex-col gap-3">
      <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[17px] bg-[#F6EFE7]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={showPhoto ? item.image : EXCELLENCE_FALLBACK_IMAGE}
          alt=""
          className={
            showPhoto
              ? "h-full w-full object-cover"
              : "h-[70%] w-[70%] object-contain"
          }
          draggable={false}
          onError={() => setBroken(true)}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex w-fit rounded-full bg-[#F6F1E8] px-2.5 py-1 text-[11px] font-semibold text-[#D5AF34]">
            {categoryLabel}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/star-medal%201.svg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 object-contain"
            draggable={false}
          />
        </div>
        <h3 className="text-start text-[15px] font-bold leading-7 text-[#170F49] sm:text-[16px]">
          {name}
        </h3>
        <p className="text-start text-sm leading-6 text-[#6B6B7B]">{title}</p>

        <button
          type="button"
          onClick={() => onShowMore(item.id)}
          className="mt-auto inline-flex w-full items-center justify-center rounded-[10px] border border-[#D5AF34] bg-white px-4 py-2.5 text-sm font-bold text-[#D5AF34] transition hover:bg-[#FBF6E6]"
        >
          {showMoreLabel}
        </button>
      </div>
    </article>
  );
}
