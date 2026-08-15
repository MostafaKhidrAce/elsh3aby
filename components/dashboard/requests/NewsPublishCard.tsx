"use client";

import { Clock, MapPin } from "lucide-react";
import type {
  DummyNewsPublishRequest,
  NewsPublishStatus,
} from "@/lib/dashboard/dummy-news-publish";
import type { Locale } from "@/lib/i18n/config";

type NewsPublishCardProps = {
  item: DummyNewsPublishRequest;
  locale: Locale;
  statusLabels: Record<NewsPublishStatus, string>;
};

const statusStyles: Record<NewsPublishStatus, string> = {
  review: "bg-[#F3EBD2] text-[#5C4A1F]",
  accepted: "bg-[#22C55E] text-white",
  rejected: "bg-[#FCE7E7] text-[#DC2626]",
};

export function NewsPublishCard({
  item,
  locale,
  statusLabels,
}: NewsPublishCardProps) {
  const isAr = locale === "ar";
  const title = isAr ? item.title : item.titleEn;
  const description = isAr ? item.description : item.descriptionEn;
  const location = isAr ? item.location : item.locationEn;
  const time = isAr ? item.time : item.timeEn;

  return (
    <article className="flex h-full flex-col rounded-[16px] border border-[#EFEFEF] bg-white p-4 shadow-[0_4px_18px_rgba(25,33,61,0.04)] sm:p-5">
      <h3 className="mb-2 text-start text-[15px] font-bold leading-7 text-[#170F49] sm:text-[16px]">
        {title}
      </h3>
      <p className="mb-4 line-clamp-3 text-start text-sm leading-6 text-[#6B6B7B]">
        {description}
      </p>

      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#6B6B7B] sm:text-[13px]">
          <span className="inline-flex max-w-full items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#EF4444]" strokeWidth={2} />
            <span className="truncate">{location}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" strokeWidth={2} />
            <span>{time}</span>
          </span>
        </div>

        <div className="flex justify-center pt-1">
          <span
            className={`inline-flex min-w-[120px] items-center justify-center rounded-full px-5 py-2 text-sm font-bold ${statusStyles[item.status]}`}
          >
            {statusLabels[item.status]}
          </span>
        </div>
      </div>
    </article>
  );
}
