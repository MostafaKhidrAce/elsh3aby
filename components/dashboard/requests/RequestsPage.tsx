"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Files, Plus, Search } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardItemsEmptyState } from "@/components/dashboard/DashboardItemsEmptyState";
import { OfferCard } from "@/components/dashboard/offers/OfferCard";
import { RequestCategoryFilters } from "@/components/dashboard/requests/RequestCategoryFilters";
import { RequestStatusAccordion } from "@/components/dashboard/requests/RequestStatusAccordion";
import { DUMMY_OFFERS } from "@/lib/dashboard/dummy-offers";
import {
  REQUEST_STATUSES,
  getCategoryCounts,
  getRequestsByCategory,
  groupByStatus,
  type RequestCategory,
  type RequestStatus,
} from "@/lib/dashboard/dummy-requests";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type RequestsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function RequestsPage({ locale, dictionary }: RequestsPageProps) {
  const t = dictionary.dashboard.requestsPage;
  const [category, setCategory] = useState<RequestCategory>("help");
  const [query, setQuery] = useState("");
  const [openStatuses, setOpenStatuses] = useState<Set<RequestStatus>>(
    () => new Set(["pending", "approved", "rejected"]),
  );
  const [showMoreByStatus, setShowMoreByStatus] = useState<
    Record<RequestStatus, boolean>
  >({
    pending: false,
    approved: false,
    rejected: false,
  });

  const counts = useMemo(() => {
    const base = getCategoryCounts();
    return { ...base, offers: DUMMY_OFFERS.length };
  }, []);

  const categoryLabels: Record<RequestCategory, string> = {
    help: t.categoryHelp,
    consult: t.categoryConsult,
    offers: t.categoryOffers,
    news: t.categoryNews,
    booking: t.categoryBooking,
  };

  const statusLabels: Record<RequestStatus, string> = {
    pending: t.statusPending,
    approved: t.statusApproved,
    rejected: t.statusRejected,
  };

  const filters = (
    ["help", "consult", "offers", "news", "booking"] as RequestCategory[]
  ).map((id) => ({
    id,
    label: categoryLabels[id],
    count: counts[id],
  }));

  const isOffers = category === "offers";
  const isHelp = category === "help";
  const isConsult = category === "consult";

  const filtered = useMemo(() => {
    if (isOffers) return [];
    const q = query.trim().toLowerCase();
    return getRequestsByCategory(category).filter((item) => {
      if (!q) return true;
      return [item.title, item.titleEn, item.rejectionReason, item.rejectionReasonEn]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [category, query, isOffers]);

  const filteredOffers = useMemo(() => {
    if (!isOffers) return [];
    const q = query.trim().toLowerCase();
    return DUMMY_OFFERS.filter((offer) => {
      if (!q) return true;
      return [
        offer.title,
        offer.titleEn,
        offer.description,
        offer.descriptionEn,
        offer.location,
        offer.locationEn,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [isOffers, query]);

  const grouped = useMemo(() => groupByStatus(filtered), [filtered]);

  const newHelpButton = (
    <Link
      href={`/${locale}/dashboard/add-request`}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#D5AF34] px-6 py-3 text-sm font-bold text-white transition hover:brightness-95"
    >
      <Plus className="h-4 w-4" strokeWidth={2.5} />
      {t.newHelp}
    </Link>
  );

  const newConsultButton = (
    <Link
      href={`/${locale}/dashboard/add-consultation`}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#D5AF34] px-6 py-3 text-sm font-bold text-white transition hover:brightness-95"
    >
      <Plus className="h-4 w-4" strokeWidth={2.5} />
      {t.newConsult}
    </Link>
  );

  const newOfferButton = (
    <Link
      href={`/${locale}/dashboard/add-offer`}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#D5AF34] px-6 py-3 text-sm font-bold text-white transition hover:brightness-95"
    >
      <Plus className="h-4 w-4" strokeWidth={2.5} />
      {t.newOffer}
    </Link>
  );

  function toggleStatus(status: RequestStatus) {
    setOpenStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  function toggleShowMore(status: RequestStatus) {
    setShowMoreByStatus((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  }

  const isEmpty = isOffers
    ? filteredOffers.length === 0
    : filtered.length === 0;

  return (
    <div className="space-y-4 sm:space-y-5">
      <header
        className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
            {t.title}
          </h1>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#133D3C]">
            <Files className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
            <span>{categoryLabels[category]}</span>
          </div>
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={`${cardClass} space-y-6`}>
        <div className="flex w-full justify-center">
          <label className="relative block w-full max-w-md min-w-0">
            <span className="sr-only">{t.searchPlaceholder}</span>
            <Search
              className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF] start-4"
              strokeWidth={2}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="box-border w-full min-w-0 rounded-[10px] border border-[#E8E8E8] bg-[#F5F5F5] py-3.5 pe-4 ps-11 text-sm text-[#170F49] outline-none transition placeholder:text-[#A0A0B0] focus:border-[#D5AF34] focus:bg-white"
            />
          </label>
        </div>

        <RequestCategoryFilters
          filters={filters}
          active={category}
          onChange={(id) => {
            setCategory(id);
            setShowMoreByStatus({
              pending: false,
              approved: false,
              rejected: false,
            });
          }}
        />

        {isEmpty ? (
          <DashboardItemsEmptyState
            title={
              isConsult
                ? t.consultEmptyTitle
                : isOffers
                  ? t.offersEmptyTitle
                  : t.emptyTitle
            }
            description={
              isConsult
                ? t.consultEmptyDescription
                : isOffers
                  ? t.offersEmptyDescription
                  : t.emptyDescription
            }
            imageSrc={
              isConsult
                ? "/backgrounds/table.svg"
                : "/backgrounds/items-not.svg"
            }
            action={
              isHelp
                ? newHelpButton
                : isConsult
                  ? newConsultButton
                  : isOffers
                    ? newOfferButton
                    : undefined
            }
          />
        ) : isOffers ? (
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  locale={locale}
                  getOfferLabel={t.getOffer}
                  couponLabel={t.couponLabel}
                  copiedLabel={t.copied}
                />
              ))}
            </div>
            <div className="flex justify-center pt-2">{newOfferButton}</div>
          </div>
        ) : (
          <div className="space-y-5">
            {REQUEST_STATUSES.map((status) => (
              <RequestStatusAccordion
                key={status}
                status={status}
                title={statusLabels[status]}
                items={grouped[status]}
                locale={locale}
                open={openStatuses.has(status)}
                onToggle={() => toggleStatus(status)}
                showMore={showMoreByStatus[status]}
                onToggleShowMore={() => toggleShowMore(status)}
                showMoreLabel={t.showMore}
                showLessLabel={t.showLess}
                rejectionReasonLabel={t.rejectionReason}
                attachmentsLabel={t.attachments}
                downloadLabel={t.downloadAttachments}
                responsesLabel={t.consultationResponses}
              />
            ))}

            {isHelp ? (
              <div className="flex justify-center pt-2">{newHelpButton}</div>
            ) : null}
            {isConsult ? (
              <div className="flex justify-center pt-2">{newConsultButton}</div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
