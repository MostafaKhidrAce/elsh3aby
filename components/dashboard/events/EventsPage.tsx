"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsCalendarModal } from "@/components/dashboard/events/EventsCalendarModal";
import { EventsCategorySection } from "@/components/dashboard/events/EventsCategorySection";
import { EventsDateSlider } from "@/components/dashboard/events/EventsDateSlider";
import { EventsEmptyState } from "@/components/dashboard/events/EventsEmptyState";
import { EventsToolbar } from "@/components/dashboard/events/EventsToolbar";
import {
  DUMMY_EVENTS,
  SLIDER_DATES,
  getDatesWithEvents,
  toDateKey,
  type EventCategoryId,
} from "@/lib/dashboard/dummy-events";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type EventsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const CATEGORY_ORDER: EventCategoryId[] = ["wedding", "meetings"];

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function EventsPage({ locale, dictionary }: EventsPageProps) {
  const t = dictionary.dashboard.eventsPage;
  const todayKey = toDateKey(new Date());

  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<EventCategoryId>>(new Set());
  const [remindedIds, setRemindedIds] = useState<Set<string>>(new Set());

  const datesWithEvents = useMemo(() => getDatesWithEvents(), []);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return DUMMY_EVENTS.filter((event) => {
      if (event.dateKey !== selectedDate) return false;
      if (!query) return true;
      const haystack = [
        event.title,
        event.titleEn,
        event.description,
        event.descriptionEn,
        event.location,
        event.locationEn,
        event.publisherName,
        event.publisherNameEn,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [selectedDate, searchQuery]);

  const eventsTodayCount = useMemo(
    () => DUMMY_EVENTS.filter((event) => event.dateKey === selectedDate).length,
    [selectedDate],
  );

  const categoryTitle = (id: EventCategoryId) =>
    id === "wedding" ? t.categoryWedding : t.categoryMeetings;

  function toggleExpand(categoryId: EventCategoryId) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  function toggleRemind(id: string) {
    setRemindedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header: title + all events | user menu */}
      <header
        className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="space-y-2">
          <h1 className="text-[22px] font-bold leading-tight text-[#170F49] sm:text-[26px]">
            {t.overviewTitle}
          </h1>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#133D3C]">
            <CalendarDays className="h-4 w-4 text-[#133D3C]" strokeWidth={2} />
            <span>{t.allEvents}</span>
          </div>
        </div>

        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      {/* Date panel: hijri + actions + slider */}
      <section className={`${cardClass} space-y-5`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-[20px] font-bold text-[#133D3C] sm:text-[22px]">
              {t.hijriDate}
            </p>
            <p className="text-sm text-[#6B7280]">
              {t.eventsToday.replace("{count}", String(eventsTodayCount))}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              className="inline-flex items-center gap-2 rounded-[12px] bg-[#D5AF34] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
            >
              <CalendarDays className="h-4 w-4" strokeWidth={2} />
              {t.calendar}
            </button>
            <Link
              href={`/${locale}/dashboard/add-event`}
              className="inline-flex items-center gap-2 rounded-[12px] bg-[#D5AF34] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              {t.addEvent}
            </Link>
          </div>
        </div>

        <EventsDateSlider
          dates={SLIDER_DATES}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          weekdays={t.weekdays}
          locale={locale}
        />
      </section>

      {/* Events list card */}
      <section className={`${cardClass} space-y-6`}>
        <EventsToolbar
          allSectionsLabel={t.allSections}
          searchPlaceholder={t.searchPlaceholder}
          filterLabel={t.filter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {filteredEvents.length === 0 ? (
          <EventsEmptyState
            title={t.emptyTitle}
            description={t.emptyDescription}
          />
        ) : (
          <div className="space-y-8">
            {CATEGORY_ORDER.map((categoryId) => {
              const events = filteredEvents.filter(
                (event) => event.category === categoryId,
              );
              return (
                <EventsCategorySection
                  key={categoryId}
                  categoryId={categoryId}
                  title={categoryTitle(categoryId)}
                  events={events}
                  locale={locale}
                  expanded={expanded.has(categoryId)}
                  onToggleExpand={toggleExpand}
                  seeMoreLabel={t.seeMore}
                  seeLessLabel={t.seeLess}
                  remindLabel={t.remind}
                  cancelRemindLabel={t.cancelRemind}
                  bookedByLabel={t.bookedBy}
                  remindedIds={remindedIds}
                  onToggleRemind={toggleRemind}
                />
              );
            })}
          </div>
        )}
      </section>

      <EventsCalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        datesWithEvents={datesWithEvents}
        weekdays={t.weekdays}
        months={t.months}
        locale={locale}
        title={t.calendar}
      />
    </div>
  );
}
