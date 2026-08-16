"use client";

import Image from "next/image";
import Link from "next/link";
import type { DummyAchievement } from "@/lib/dashboard/dummy-achievements";
import type { Locale } from "@/lib/i18n/config";

const PLACEHOLDER_AVATAR = "/placeholder/user-placeholder-img.svg";

const badgeToneClass: Record<DummyAchievement["badgeTone"], string> = {
  gold: "bg-[#F6E9B8] text-[#B8860B]",
  green: "bg-[#E8F5E9] text-[#2E7D32]",
  blue: "bg-[#E3F2FD] text-[#1565C0]",
};

type AchievementCardProps = {
  item: DummyAchievement;
  locale: Locale;
  writtenByLabel: string;
};

export function AchievementCard({
  item,
  locale,
  writtenByLabel,
}: AchievementCardProps) {
  const isAr = locale === "ar";
  const title = isAr ? item.title : item.titleEn;
  const badge = isAr ? item.badge : item.badgeEn;
  const dateLabel = isAr ? item.dateLabel : item.dateLabelEn;
  const author = isAr ? item.author : item.authorEn;
  const branch = isAr ? item.branch : item.branchEn;
  const href = `/${locale}/dashboard/achievements/${item.id}`;

  return (
    <article className="flex h-full flex-col gap-3">
      <Link href={href} className="group block space-y-3">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-[#F5F5F5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.images[0]}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <span
            className={`absolute top-3 start-3 rounded-md px-2.5 py-1 text-[11px] font-bold ${badgeToneClass[item.badgeTone]}`}
          >
            {badge}
          </span>
        </div>

        <p className="text-[12px] text-[#9CA3AF] sm:text-[13px]">{dateLabel}</p>
        <h3 className="line-clamp-2 text-start text-[15px] font-bold leading-7 text-[#170F49] sm:text-[16px]">
          {title}
        </h3>

        <div className="flex items-center gap-2">
          <Image
            src={PLACEHOLDER_AVATAR}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
          <p className="truncate text-sm text-[#5C5C6B]">
            <span className="text-[#9CA3AF]">{writtenByLabel}: </span>
            <span className="font-semibold text-[#170F49]">{author}</span>
          </p>
        </div>

        <span className="inline-flex w-fit rounded-md bg-[#F4E8C0] px-2.5 py-1 text-[11px] font-semibold text-[#D5AF34]">
          {branch}
        </span>
      </Link>
    </article>
  );
}
