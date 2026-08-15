"use client";

import Image from "next/image";
import { CalendarDays, Clock } from "lucide-react";
import type { DummyVenueBooking } from "@/lib/dashboard/dummy-venue-bookings";
import type { Locale } from "@/lib/i18n/config";

const PLACEHOLDER_AVATAR = "/placeholder/user-placeholder-img.svg";

type VenueBookingCardProps = {
  booking: DummyVenueBooking;
  locale: Locale;
  bookedByLabel: string;
};

export function VenueBookingCard({
  booking,
  locale,
  bookedByLabel,
}: VenueBookingCardProps) {
  const isAr = locale === "ar";
  const title = isAr ? booking.title : booking.titleEn;
  const description = isAr ? booking.description : booking.descriptionEn;
  const dateLabel = isAr ? booking.dateLabel : booking.dateLabelEn;
  const time = isAr ? booking.time : booking.timeEn;
  const hallLabel = isAr ? booking.hallLabel : booking.hallLabelEn;
  const bookedBy = isAr ? booking.bookedBy : booking.bookedByEn;
  const branch = isAr ? booking.branch : booking.branchEn;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#EAEAEA] bg-white shadow-[0_2px_12px_rgba(25,33,61,0.04)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5F5F5]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={booking.image}
          alt=""
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-3 start-3 rounded-md bg-black/55 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {hallLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <h3 className="text-start text-[15px] font-bold leading-7 text-[#170F49] sm:text-[16px]">
          {title}
        </h3>
        <p className="line-clamp-2 text-start text-sm leading-6 text-[#6B6B7B]">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#6B6B7B] sm:text-[13px]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays
              className="h-3.5 w-3.5 shrink-0 text-[#D5AF34]"
              strokeWidth={2}
            />
            <span>{dateLabel}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock
              className="h-3.5 w-3.5 shrink-0 text-[#D5AF34]"
              strokeWidth={2}
            />
            <span>{time}</span>
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2.5 pt-1">
          <Image
            src={PLACEHOLDER_AVATAR}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-[11px] text-[#9CA3AF]">{bookedByLabel}</p>
            <p className="truncate text-sm font-bold text-[#170F49]">
              {bookedBy}
            </p>
            <span className="mt-1 inline-flex rounded-md bg-[#F4E8C0] px-2 py-0.5 text-[11px] font-semibold text-[#D5AF34]">
              {branch}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
