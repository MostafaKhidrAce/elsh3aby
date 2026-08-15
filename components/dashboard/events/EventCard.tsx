"use client";

import Image from "next/image";
import { Bell, MapPin, Clock } from "lucide-react";
import type { DummyEvent } from "@/lib/dashboard/dummy-events";
import type { Locale } from "@/lib/i18n/config";

const GOLD = "#D5AF34";
const PLACEHOLDER_AVATAR = "/placeholder/user-placeholder-img.svg";

type EventCardProps = {
  event: DummyEvent;
  locale: Locale;
  remindLabel: string;
  cancelRemindLabel: string;
  bookedByLabel: string;
  reminded: boolean;
  onToggleRemind: (id: string) => void;
};

export function EventCard({
  event,
  locale,
  remindLabel,
  cancelRemindLabel,
  bookedByLabel,
  reminded,
  onToggleRemind,
}: EventCardProps) {
  const isAr = locale === "ar";
  const title = isAr ? event.title : event.titleEn;
  const description = isAr ? event.description : event.descriptionEn;
  const location = isAr ? event.location : event.locationEn;
  const publisher = isAr ? event.publisherName : event.publisherNameEn;
  const branch = isAr ? event.branch : event.branchEn;

  return (
    <article className="flex h-full flex-col rounded-[18px] border border-[#EAEAEA] bg-white p-5 shadow-[0_2px_12px_rgba(25,33,61,0.04)] sm:p-6">
      <h3 className="text-[17px] font-bold leading-snug text-[#170F49] sm:text-[18px]">
        {title}
      </h3>

      <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#8B8B9A]">
        {description}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13px] text-[#5C5C6B]">
        <div className="flex min-w-0 items-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0" style={{ color: GOLD }} strokeWidth={2} />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 shrink-0" style={{ color: GOLD }} strokeWidth={2} />
          <span className="whitespace-nowrap">{event.time}</span>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image
            src={PLACEHOLDER_AVATAR}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-[11px] text-[#9CA3AF]">{bookedByLabel}</p>
            <p className="truncate text-sm font-bold text-[#170F49]">{publisher}</p>
            {branch ? (
              <span className="mt-1 inline-flex rounded-md bg-[#F4E8C0] px-2 py-0.5 text-[11px] font-semibold text-[#D5AF34]">
                {branch}
              </span>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleRemind(event.id)}
          aria-pressed={reminded}
          className={`relative inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2.5 text-[12px] font-semibold transition sm:text-[13px] ${
            reminded
              ? "border-[#D5AF34] bg-[#D5AF34] text-white"
              : "border-[#D5AF34] bg-white text-[#D5AF34] hover:bg-[#FBF6E6]"
          }`}
        >
          <span className="relative inline-flex">
            <Bell
              className="h-4 w-4"
              strokeWidth={2}
              color={reminded ? "white" : GOLD}
              fill={reminded ? "white" : "none"}
            />
            {reminded ? (
              <span className="absolute -end-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#D5AF34] ring-2 ring-white" />
            ) : null}
          </span>
          {reminded ? cancelRemindLabel : remindLabel}
        </button>
      </div>
    </article>
  );
}
