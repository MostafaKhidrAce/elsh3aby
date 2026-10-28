"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { SubscriptionAddLink } from "@/components/dashboard/SubscriptionGate";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { EventsCalendarModal } from "@/components/dashboard/events/EventsCalendarModal";
import { EventsCategorySection } from "@/components/dashboard/events/EventsCategorySection";
import { EventsDateSlider } from "@/components/dashboard/events/EventsDateSlider";
import { EventsEmptyState } from "@/components/dashboard/events/EventsEmptyState";
import {
  EventsFilterModal,
  type EventsFilterValues,
} from "@/components/dashboard/events/EventsFilterModal";
import { EventsToolbar } from "@/components/dashboard/events/EventsToolbar";
import { getFamilyBranches, type FamilyBranch } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getEventTypes, type NamedType } from "@/lib/api/catalog";
import {
  getEvents,
  rateEvent,
  toggleEventReminder,
  type EventCardView,
} from "@/lib/api/events";
import { pickNamed } from "@/lib/api/localized";
import { useAuth } from "@/lib/auth/auth-context";
import { buildSliderDates, parseDateKey, toDateKey } from "@/lib/dashboard/dummy-events";
import { formatHijriLabel } from "@/lib/hijri";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type EventsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function EventsPage({ locale, dictionary }: EventsPageProps) {
  const t = dictionary.dashboard.eventsPage;
  const todayKey = toDateKey(new Date());
  const { token, isReady } = useAuth();
  const sliderDates = useMemo(() => buildSliderDates(21), []);

  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<EventsFilterValues>({
    typeId: "",
    branchId: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [types, setTypes] = useState<NamedType[]>([]);
  const [branches, setBranches] = useState<FamilyBranch[]>([]);
  const [events, setEvents] = useState<EventCardView[]>([]);
  const [datesWithEvents, setDatesWithEvents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDay = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [liveTypes, liveEvents, liveBranches] = await Promise.all([
        getEventTypes(locale, token),
        getEvents(locale, token, {
          date: selectedDate,
          type_id: filters.typeId || undefined,
          family_branch_id: filters.branchId || undefined,
          per_page: 50,
        }),
        getFamilyBranches(locale, token).catch(() => [] as FamilyBranch[]),
      ]);
      setTypes(liveTypes);
      setEvents(liveEvents);
      setBranches(liveBranches);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    } finally {
      setLoading(false);
    }
  }, [token, locale, selectedDate, filters, dictionary.common.loadError]);

  const loadRangeMarkers = useCallback(
    (from: string, to: string) => {
      if (!token) return;
      void getEvents(locale, token, { date_from: from, date_to: to, per_page: 50 })
        .then((items) =>
          setDatesWithEvents((prev) => {
            const next = new Set(prev);
            for (const item of items) {
              if (item.dateKey) next.add(item.dateKey);
            }
            return next;
          }),
        )
        .catch(() => undefined);
    },
    [token, locale],
  );

  useEffect(() => {
    if (!isReady || !token) return;
    void loadDay();
  }, [isReady, token, loadDay]);

  useEffect(() => {
    if (!token) return;
    loadRangeMarkers(sliderDates[0], sliderDates[sliderDates.length - 1]);
  }, [token, sliderDates, loadRangeMarkers]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return events.filter((event) => {
      if (filters.typeId && String(event.typeId) !== filters.typeId) return false;
      if (filters.branchId && String(event.branchId ?? "") !== filters.branchId) return false;
      if (!query) return true;
      return [event.title, event.description, event.location, event.publisherName, event.branch]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [events, searchQuery, filters]);

  const hijriLabel = formatHijriLabel(parseDateKey(selectedDate), locale);
  const typeOptions = useMemo(
    () =>
      types.map((type) => ({
        value: String(type.id),
        label: pickNamed(locale, type),
      })),
    [types, locale],
  );
  const branchOptions = useMemo(
    () =>
      branches.map((branch) => ({
        value: String(branch.id),
        label: pickNamed(locale, branch),
      })),
    [branches, locale],
  );

  const groupedTypes = useMemo(() => {
    const used = new Map<number, EventCardView[]>();
    for (const event of filteredEvents) {
      const list = used.get(event.typeId) ?? [];
      list.push(event);
      used.set(event.typeId, list);
    }
    const ordered = types
      .filter((type) => used.has(type.id))
      .map((type) => ({
        id: String(type.id),
        title: pickNamed(locale, type),
        events: used.get(type.id) ?? [],
      }));
    for (const [typeId, typeEvents] of used) {
      if (types.some((type) => type.id === typeId)) continue;
      ordered.push({
        id: String(typeId),
        title: typeEvents[0]?.typeName || t.allSections,
        events: typeEvents,
      });
    }
    return ordered;
  }, [filteredEvents, types, locale, t.allSections]);

  async function handleRemind(id: number) {
    if (!token) return;
    try {
      await toggleEventReminder(id, locale, token);
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, isReminderSet: !event.isReminderSet } : event,
        ),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    }
  }

  async function handleRate(id: number, rating: number) {
    if (!token) return;
    try {
      await rateEvent(id, rating, locale, token);
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id
            ? {
                ...event,
                isRated: true,
                canRate: false,
                ratingAverage: rating,
                ratingCount: event.ratingCount + 1,
              }
            : event,
        ),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-5">
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

      <section className={`${cardClass} space-y-5`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-[20px] font-bold text-[#133D3C] sm:text-[22px]">
              {hijriLabel}
            </p>
            <p className="text-sm text-[#6B7280]">
              {t.eventsToday.replace("{count}", String(events.length))}
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
            <SubscriptionAddLink
              href={`/${locale}/dashboard/add-event`}
              className="inline-flex items-center gap-2 rounded-[12px] bg-[#D5AF34] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              {t.addEvent}
            </SubscriptionAddLink>
          </div>
        </div>

        <EventsDateSlider
          dates={sliderDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          weekdays={t.weekdays}
          locale={locale}
        />
      </section>

      <section className={`${cardClass} space-y-6`}>
        <EventsToolbar
          allSectionsLabel={t.allSections}
          searchPlaceholder={t.searchPlaceholder}
          filterLabel={t.filter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterActive={Boolean(filters.typeId || filters.branchId)}
          onFilterClick={() => setFilterOpen(true)}
        />

        <DashboardFetchState
          loading={loading}
          error={error}
          loadingLabel={dictionary.common.loading}
          retryLabel={dictionary.common.retry}
          onRetry={() => void loadDay()}
        />

        {!loading && !error && filteredEvents.length === 0 ? (
          <EventsEmptyState
            title={t.emptyTitle}
            description={t.emptyDescription}
          />
        ) : null}

        {!loading && filteredEvents.length > 0 ? (
          <div className="space-y-8">
            {groupedTypes.map((group) => (
              <EventsCategorySection
                key={group.id}
                categoryId={group.id}
                title={group.title}
                events={group.events}
                locale={locale}
                expanded={expanded.has(group.id)}
                onToggleExpand={(id) => {
                  setExpanded((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  });
                }}
                seeMoreLabel={t.seeMore}
                seeLessLabel={t.seeLess}
                remindLabel={t.remind}
                cancelRemindLabel={t.cancelRemind}
                bookedByLabel={t.bookedBy}
                rateLabel={t.rateEvent}
                ratedLabel={t.rated}
                onToggleRemind={handleRemind}
                onRate={handleRate}
              />
            ))}
          </div>
        ) : null}
      </section>

      <EventsCalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        datesWithEvents={datesWithEvents}
        weekdays={t.weekdays}
        locale={locale}
        title={t.calendar}
        onVisibleRangeChange={loadRangeMarkers}
      />

      <EventsFilterModal
        open={filterOpen}
        locale={locale}
        title={t.filterModalTitle}
        typeLabel={t.filterType}
        branchLabel={t.filterBranch}
        showResultsLabel={t.showResults}
        typeOptions={typeOptions}
        branchOptions={branchOptions}
        values={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {
          setFilters(next);
          setFilterOpen(false);
        }}
      />
    </div>
  );
}
