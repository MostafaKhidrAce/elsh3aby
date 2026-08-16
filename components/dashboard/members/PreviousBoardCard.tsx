"use client";

import Link from "next/link";
import { BOARD_CARD_IMAGE, type DummyPreviousBoard } from "@/lib/dashboard/dummy-members";
import type { Locale } from "@/lib/i18n/config";

type PreviousBoardCardProps = {
  board: DummyPreviousBoard;
  locale: Locale;
};

export function PreviousBoardCard({ board, locale }: PreviousBoardCardProps) {
  const isAr = locale === "ar";
  const title = isAr ? board.title : board.titleEn;
  const dateRange = isAr ? board.dateRange : board.dateRangeEn;
  const href = `/${locale}/dashboard/members/boards/${board.id}`;

  return (
    <Link
      href={href}
      className="flex h-full flex-col items-center gap-3 text-center transition hover:opacity-95"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-[17px] bg-[#F5F5F5]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BOARD_CARD_IMAGE}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
      <h3 className="text-[15px] font-bold text-[#170F49] sm:text-[16px]">
        {title}
      </h3>
      <p className="text-sm text-[#9CA3AF]">{dateRange}</p>
    </Link>
  );
}
