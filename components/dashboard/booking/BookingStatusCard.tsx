"use client";

import Image from "next/image";
import { CalendarDays, Clock, Gem } from "lucide-react";
import type { BookingStatusItem } from "@/lib/dashboard/dummy-venue-bookings";
import type { Locale } from "@/lib/i18n/config";

const PLACEHOLDER_AVATAR = "/placeholder/user-placeholder-img.svg";

type BookingStatusCardProps = {
  booking: BookingStatusItem;
  locale: Locale;
  pendingLabel: string;
  approvedLabel: string;
  bookedByLabel: string;
  postponeLabel: string;
  cancelLabel: string;
  payLabel: string;
  onPostpone: (id: string) => void;
  onCancel: (id: string) => void;
  onPay: (id: string) => void;
};

export function BookingStatusCard({
  booking,
  locale,
  pendingLabel,
  approvedLabel,
  bookedByLabel,
  postponeLabel,
  cancelLabel,
  payLabel,
  onPostpone,
  onCancel,
  onPay,
}: BookingStatusCardProps) {
  const isAr = locale === "ar";
  const title = isAr ? booking.title : booking.titleEn;
  const description = isAr ? booking.description : booking.descriptionEn;
  const dateLabel = isAr ? booking.dateLabel : booking.dateLabelEn;
  const time = isAr ? booking.time : booking.timeEn;
  const bookedBy = isAr ? booking.bookedBy : booking.bookedByEn;
  const branch = isAr ? booking.branch : booking.branchEn;
  const isApproved = booking.status === "approved";

  return (
    <article className="rounded-[18px] border border-[#EAEAEA] bg-white p-4 shadow-[0_2px_12px_rgba(25,33,61,0.04)] sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
            isApproved
              ? "bg-[#E8F8EF] text-[#16A34A]"
              : "bg-[#FFF1E0] text-[#E67E22]"
          }`}
        >
          {isApproved ? approvedLabel : pendingLabel}
        </span>
      </div>

      <div className="flex gap-3">
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#FBF6E6]">
          <Gem className="h-6 w-6 text-[#D5AF34]" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-start text-[15px] font-bold leading-7 text-[#170F49] sm:text-[16px]">
            {title}
          </h3>
          <p className="text-start text-sm leading-6 text-[#6B6B7B]">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#6B6B7B] sm:text-[13px]">
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

      <div className="mt-4 flex flex-col gap-4 border-t border-[#F0F0F0] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
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

        <div className="flex flex-wrap items-center gap-2">
          {isApproved ? (
            <button
              type="button"
              onClick={() => onPay(booking.id)}
              className="inline-flex min-w-[96px] items-center justify-center rounded-[10px] bg-[#D5AF34] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95"
            >
              {payLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onPostpone(booking.id)}
            className="inline-flex min-w-[96px] items-center justify-center rounded-[10px] bg-[#133D3C] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            {postponeLabel}
          </button>
          <button
            type="button"
            onClick={() => onCancel(booking.id)}
            className="inline-flex min-w-[96px] items-center justify-center rounded-[10px] border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm font-bold text-[#133D3C] transition hover:bg-[#F5F5F5]"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
