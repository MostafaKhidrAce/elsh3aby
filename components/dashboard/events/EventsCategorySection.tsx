"use client";

import { Users } from "lucide-react";
import { EventCard } from "@/components/dashboard/events/EventCard";
import type { EventCardView } from "@/lib/api/events";
import type { Locale } from "@/lib/i18n/config";

type EventsCategorySectionProps = {
  categoryId: string;
  title: string;
  events: EventCardView[];
  locale: Locale;
  expanded: boolean;
  onToggleExpand: (categoryId: string) => void;
  seeMoreLabel: string;
  seeLessLabel: string;
  remindLabel: string;
  cancelRemindLabel: string;
  bookedByLabel: string;
  rateLabel: string;
  ratedLabel: string;
  onToggleRemind: (id: number) => void;
  onRate: (id: number, rating: number) => void;
};

const VISIBLE_COUNT = 3;

export function EventsCategorySection({
  categoryId,
  title,
  events,
  locale,
  expanded,
  onToggleExpand,
  seeMoreLabel,
  seeLessLabel,
  remindLabel,
  cancelRemindLabel,
  bookedByLabel,
  rateLabel,
  ratedLabel,
  onToggleRemind,
  onRate,
}: EventsCategorySectionProps) {
  if (events.length === 0) return null;

  const visible = expanded ? events : events.slice(0, VISIBLE_COUNT);
  const canExpand = events.length > VISIBLE_COUNT;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#D5AF34]">
          <Users className="h-4 w-4 text-white" strokeWidth={2} />
        </span>
        <h3 className="text-lg font-bold text-[#170F49]">
          {title}{" "}
          <span className="font-semibold text-[#170F49]">({events.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            locale={locale}
            remindLabel={remindLabel}
            cancelRemindLabel={cancelRemindLabel}
            bookedByLabel={bookedByLabel}
            rateLabel={rateLabel}
            ratedLabel={ratedLabel}
            reminded={event.isReminderSet}
            onToggleRemind={onToggleRemind}
            onRate={onRate}
          />
        ))}
      </div>

      {canExpand ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => onToggleExpand(categoryId)}
            className="rounded-full bg-[#F3EBD2] px-8 py-2.5 text-sm font-semibold text-[#5C5C6B] transition hover:brightness-95"
          >
            {expanded ? seeLessLabel : seeMoreLabel}
          </button>
        </div>
      ) : null}
    </section>
  );
}
