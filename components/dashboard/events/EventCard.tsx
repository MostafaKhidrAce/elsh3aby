"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, MapPin, Clock, Star } from "lucide-react";
import type { EventCardView } from "@/lib/api/events";
import type { Locale } from "@/lib/i18n/config";

const GOLD = "#D5AF34";
const PLACEHOLDER_AVATAR = "/placeholder/user-placeholder-img.svg";

type EventCardProps = {
  event: EventCardView;
  locale: Locale;
  remindLabel: string;
  cancelRemindLabel: string;
  bookedByLabel: string;
  rateLabel: string;
  ratedLabel: string;
  reminded: boolean;
  onToggleRemind: (id: number) => void;
  onRate: (id: number, rating: number) => void;
};

export function EventCard({
  event,
  locale,
  remindLabel,
  cancelRemindLabel,
  bookedByLabel,
  rateLabel,
  ratedLabel,
  reminded,
  onToggleRemind,
  onRate,
}: EventCardProps) {
  const href = `/${locale}/dashboard/events/${event.id}`;
  const rating = Math.round(event.ratingAverage);

  return (
    <article className="flex h-full flex-col rounded-[18px] border border-[#EAEAEA] bg-white p-5 shadow-[0_2px_12px_rgba(25,33,61,0.04)] sm:p-6">
      <Link href={href} className="block space-y-2 transition hover:opacity-90">
        <h3 className="text-[17px] font-bold leading-snug text-[#170F49] sm:text-[18px]">
          {event.title}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-6 text-[#8B8B9A]">
          {event.description}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-2 text-[13px] text-[#5C5C6B]">
          <div className="flex min-w-0 items-center gap-1.5">
            <MapPin
              className="h-4 w-4 shrink-0"
              style={{ color: GOLD }}
              strokeWidth={2}
            />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock
              className="h-4 w-4 shrink-0"
              style={{ color: GOLD }}
              strokeWidth={2}
            />
            <span className="whitespace-nowrap">{event.time}</span>
          </div>
        </div>
      </Link>

      {event.canRate || event.ratingCount > 0 ? (
        <div className="flex items-center gap-2 pt-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                disabled={!event.canRate || event.isRated}
                onClick={() => onRate(event.id, value)}
                className="disabled:cursor-default"
                aria-label={`${rateLabel} ${value}`}
              >
                <Star
                  className="h-4 w-4"
                  strokeWidth={1.75}
                  color={GOLD}
                  fill={value <= rating ? GOLD : "none"}
                />
              </button>
            ))}
          </div>
          <span className="text-[11px] text-[#9CA3AF]">
            {event.isRated ? ratedLabel : rateLabel}
            {event.ratingCount ? ` (${event.ratingCount})` : ""}
          </span>
        </div>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <Link href={href} className="flex min-w-0 items-center gap-2.5">
          <Image
            src={event.publisherAvatar || PLACEHOLDER_AVATAR}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-[11px] text-[#9CA3AF]">{bookedByLabel}</p>
            <p className="truncate text-sm font-bold text-[#170F49]">{event.publisherName}</p>
            {event.branch ? (
              <span className="mt-1 inline-flex rounded-md bg-[#F4E8C0] px-2 py-0.5 text-[11px] font-semibold text-[#D5AF34]">
                {event.branch}
              </span>
            ) : null}
          </div>
        </Link>

        {event.canRemind || reminded ? (
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
            </span>
            {reminded ? cancelRemindLabel : remindLabel}
          </button>
        ) : null}
      </div>
    </article>
  );
}
