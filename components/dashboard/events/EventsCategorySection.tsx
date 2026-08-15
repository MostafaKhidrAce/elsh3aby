"use client";

import { Gem, Users } from "lucide-react";
import { EventCard } from "@/components/dashboard/events/EventCard";
import type { DummyEvent, EventCategoryId } from "@/lib/dashboard/dummy-events";
import type { Locale } from "@/lib/i18n/config";

type EventsCategorySectionProps = {
  categoryId: EventCategoryId;
  title: string;
  events: DummyEvent[];
  locale: Locale;
  expanded: boolean;
  onToggleExpand: (categoryId: EventCategoryId) => void;
  seeMoreLabel: string;
  seeLessLabel: string;
  remindLabel: string;
  cancelRemindLabel: string;
  bookedByLabel: string;
  remindedIds: Set<string>;
  onToggleRemind: (id: string) => void;
};

const VISIBLE_COUNT = 3;

function CategoryIcon({ categoryId }: { categoryId: EventCategoryId }) {
  if (categoryId === "wedding") {
    return <Gem className="h-4 w-4 text-white" strokeWidth={2} />;
  }
  return <Users className="h-4 w-4 text-white" strokeWidth={2} />;
}

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
  remindedIds,
  onToggleRemind,
}: EventsCategorySectionProps) {
  if (events.length === 0) return null;

  const visible = expanded ? events : events.slice(0, VISIBLE_COUNT);
  const canExpand = events.length > VISIBLE_COUNT;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#D5AF34]">
          <CategoryIcon categoryId={categoryId} />
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
            reminded={remindedIds.has(event.id)}
            onToggleRemind={onToggleRemind}
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
