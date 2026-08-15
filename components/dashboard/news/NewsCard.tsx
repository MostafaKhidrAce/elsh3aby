"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import type { DummyNewsItem } from "@/lib/dashboard/dummy-news";
import type { Locale } from "@/lib/i18n/config";

type NewsCardProps = {
  item: DummyNewsItem;
  locale: Locale;
};

export function NewsCard({ item, locale }: NewsCardProps) {
  const isAr = locale === "ar";
  const title = isAr ? item.title : item.titleEn;
  const dateLabel = isAr ? item.dateLabel : item.dateLabelEn;
  const author = isAr ? item.author : item.authorEn;
  const href = `/${locale}/dashboard/news/${item.id}`;

  return (
    <Link href={href} className="group flex h-full flex-col gap-3">
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[20px] bg-[#F5F5F5]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.coverImage}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 text-start">
        <p className="text-[12px] text-[#9CA3AF] sm:text-[13px]">{dateLabel}</p>
        <h3 className="line-clamp-2 text-[15px] font-bold leading-7 text-[#170F49] sm:text-[16px]">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF]">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EFEFEF] text-[#9CA3AF]">
            <UserRound className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
          <span className="truncate">{author}</span>
        </div>
      </div>
    </Link>
  );
}
