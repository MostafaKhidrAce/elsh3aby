"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Files, Plus, Search } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { DashboardItemsEmptyState } from "@/components/dashboard/DashboardItemsEmptyState";
import { OfferCard } from "@/components/dashboard/offers/OfferCard";
import { NewsPublishTypeSection } from "@/components/dashboard/requests/NewsPublishTypeSection";
import { RequestCategoryFilters } from "@/components/dashboard/requests/RequestCategoryFilters";
import { RequestStatusAccordion } from "@/components/dashboard/requests/RequestStatusAccordion";
import { SubscriptionRequiredModal } from "@/components/dashboard/requests/SubscriptionRequiredModal";
import { VenueBookingCard } from "@/components/dashboard/requests/VenueBookingCard";
import {
  NEWS_PUBLISH_TYPES,
  groupNewsPublishByType,
  type DummyNewsPublishRequest,
  type NewsPublishStatus,
  type NewsPublishTypeId,
} from "@/lib/dashboard/dummy-news-publish";
import type { DummyOffer } from "@/lib/dashboard/dummy-offers";
import type { DummyVenueBooking } from "@/lib/dashboard/dummy-venue-bookings";
import {
  REQUEST_STATUSES,
  groupByStatus,
  type DummyRequest,
  type RequestCategory,
  type RequestStatus,
} from "@/lib/dashboard/dummy-requests";
import { ApiError } from "@/lib/api/client";
import {
  getConsultations,
  getDiscountOffers,
  getHelpOrders,
  getPlaceBookings,
  getPublishRequests,
  getRequestsCounts,
} from "@/lib/api/requests";
import { hasLiveActivePackage } from "@/lib/api/subscriptions";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type RequestsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

const BOOKING_VISIBLE_COUNT = 6;

export function RequestsPage({ locale, dictionary }: RequestsPageProps) {
  const t = dictionary.dashboard.requestsPage;
  const { token, isReady } = useAuth();
  const [category, setCategory] = useState<RequestCategory>("help");
  const [query, setQuery] = useState("");
  const [helpItems, setHelpItems] = useState<DummyRequest[]>([]);
  const [consultItems, setConsultItems] = useState<DummyRequest[]>([]);
  const [offers, setOffers] = useState<DummyOffer[]>([]);
  const [newsItems, setNewsItems] = useState<DummyNewsPublishRequest[]>([]);
  const [bookings, setBookings] = useState<DummyVenueBooking[]>([]);
  const [apiCounts, setApiCounts] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [expandedNewsTypes, setExpandedNewsTypes] = useState<
    Set<NewsPublishTypeId>
  >(() => new Set());
  const [bookingExpanded, setBookingExpanded] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [packageActive, setPackageActive] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [help, consult, offerPage, news, venue, counts, active] =
        await Promise.all([
          getHelpOrders(locale, token),
          getConsultations(locale, token),
          getDiscountOffers(locale, token, { my_requests_only: true }),
          getPublishRequests(locale, token),
          getPlaceBookings(locale, token),
          getRequestsCounts(locale, token),
          hasLiveActivePackage(locale, token),
        ]);
      setHelpItems(help);
      setConsultItems(consult);
      setOffers(offerPage.items);
      setNewsItems(news);
      setBookings(venue);
      setApiCounts(counts);
      setPackageActive(active);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    } finally {
      setLoading(false);
    }
  }, [token, locale, dictionary.common.loadError]);

  useEffect(() => {
    if (!isReady || !token) return;
    void load();
  }, [isReady, token, load]);

  const counts = useMemo(
    () => ({
      help: Number(apiCounts?.help ?? apiCounts?.help_orders ?? helpItems.length),
      consult: Number(
        apiCounts?.consult ?? apiCounts?.consultations ?? consultItems.length,
      ),
      offers: Number(apiCounts?.offers ?? apiCounts?.discount_offers ?? offers.length),
      news: Number(apiCounts?.news ?? apiCounts?.publish_requests ?? newsItems.length),
      booking: Number(
        apiCounts?.booking ?? apiCounts?.place_bookings ?? bookings.length,
      ),
    }),
    [apiCounts, helpItems.length, consultItems.length, offers.length, newsItems.length, bookings.length],
  );

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

  const newsStatusLabels: Record<NewsPublishStatus, string> = {
    review: t.newsStatusReview,
    accepted: t.newsStatusAccepted,
    rejected: t.newsStatusRejected,
  };

  const newsTypeLabels: Record<NewsPublishTypeId, string> = {
    wedding: t.newsTypeWedding,
    meetings: t.newsTypeMeetings,
  };

  const filters = (
    ["help", "consult", "offers", "news", "booking"] as RequestCategory[]
  ).map((id) => ({
    id,
    label: categoryLabels[id],
    count: counts[id],
  }));

  const isOffers = category === "offers";
  const isNews = category === "news";
  const isBooking = category === "booking";
  const isHelp = category === "help";
  const isConsult = category === "consult";

  const filtered = useMemo(() => {
    if (isOffers || isNews || isBooking) return [];
    const source = category === "consult" ? consultItems : helpItems;
    const q = query.trim().toLowerCase();
    return source.filter((item) => {
      if (!q) return true;
      return [item.title, item.titleEn, item.rejectionReason, item.rejectionReasonEn]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [category, query, isOffers, isNews, isBooking, helpItems, consultItems]);

  const filteredOffers = useMemo(() => {
    if (!isOffers) return [];
    const q = query.trim().toLowerCase();
    return offers.filter((offer) => {
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
  }, [isOffers, query, offers]);

  const filteredNews = useMemo(() => {
    if (!isNews) return [];
    const q = query.trim().toLowerCase();
    return newsItems.filter((item) => {
      if (!q) return true;
      return [
        item.title,
        item.titleEn,
        item.description,
        item.descriptionEn,
        item.location,
        item.locationEn,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [isNews, query, newsItems]);

  const filteredBookings = useMemo(() => {
    if (!isBooking) return [];
    const q = query.trim().toLowerCase();
    return bookings.filter((item) => {
      if (!q) return true;
      return [
        item.title,
        item.titleEn,
        item.description,
        item.descriptionEn,
        item.bookedBy,
        item.bookedByEn,
        item.branch,
        item.branchEn,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [isBooking, query, bookings]);

  const visibleBookings = bookingExpanded
    ? filteredBookings
    : filteredBookings.slice(0, BOOKING_VISIBLE_COUNT);
  const canExpandBookings = filteredBookings.length > BOOKING_VISIBLE_COUNT;

  const newsGrouped = useMemo(
    () => groupNewsPublishByType(filteredNews),
    [filteredNews],
  );

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

  const newNewsButton = (
    <Link
      href={`/${locale}/dashboard/add-publish-news`}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#D5AF34] px-6 py-3 text-sm font-bold text-white transition hover:brightness-95"
    >
      <Plus className="h-4 w-4" strokeWidth={2.5} />
      {t.newNewsPublish}
    </Link>
  );

  const newBookingButton = (
    <button
      type="button"
      onClick={() => {
        if (!packageActive) {
          setSubscriptionModalOpen(true);
          return;
        }
        window.location.assign(`/${locale}/dashboard/booking`);
      }}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#D5AF34] px-6 py-3 text-sm font-bold text-white transition hover:brightness-95"
    >
      <Plus className="h-4 w-4" strokeWidth={2.5} />
      {t.newBooking}
    </button>
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

  function toggleNewsType(typeId: NewsPublishTypeId) {
    setExpandedNewsTypes((prev) => {
      const next = new Set(prev);
      if (next.has(typeId)) next.delete(typeId);
      else next.add(typeId);
      return next;
    });
  }

  const isEmpty = isOffers
    ? filteredOffers.length === 0
    : isNews
      ? filteredNews.length === 0
      : isBooking
        ? filteredBookings.length === 0
        : filtered.length === 0;

  return (
    <>
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
              setExpandedNewsTypes(new Set());
              setBookingExpanded(false);
            }}
          />

          <DashboardFetchState
            loading={loading}
            error={error}
            loadingLabel={dictionary.common.loading}
            retryLabel={dictionary.common.retry}
            onRetry={() => void load()}
          />

          {!loading && isEmpty ? (
            <DashboardItemsEmptyState
              title={
                isConsult
                  ? t.consultEmptyTitle
                  : isOffers
                    ? t.offersEmptyTitle
                    : isNews
                      ? t.newsPublishEmptyTitle
                      : isBooking
                        ? t.bookingEmptyTitle
                        : t.emptyTitle
              }
              description={
                isConsult
                  ? t.consultEmptyDescription
                  : isOffers
                    ? t.offersEmptyDescription
                    : isNews
                      ? t.newsPublishEmptyDescription
                      : isBooking
                        ? t.bookingEmptyDescription
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
                      : isNews
                        ? newNewsButton
                        : isBooking
                          ? newBookingButton
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
          ) : isNews ? (
            <div className="space-y-8">
              {NEWS_PUBLISH_TYPES.map((typeId) => (
                <NewsPublishTypeSection
                  key={typeId}
                  typeId={typeId}
                  title={newsTypeLabels[typeId]}
                  items={newsGrouped[typeId]}
                  locale={locale}
                  expanded={expandedNewsTypes.has(typeId)}
                  onToggleExpand={toggleNewsType}
                  showMoreLabel={t.showMore}
                  showLessLabel={t.showLess}
                  statusLabels={newsStatusLabels}
                />
              ))}
              <div className="flex justify-center pt-2">{newNewsButton}</div>
            </div>
          ) : isBooking ? (
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleBookings.map((booking) => (
                  <VenueBookingCard
                    key={booking.id}
                    booking={booking}
                    locale={locale}
                    bookedByLabel={t.bookingBookedBy}
                  />
                ))}
              </div>
              {canExpandBookings ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setBookingExpanded((v) => !v)}
                    className="rounded-full bg-[#F3EBD2] px-8 py-2.5 text-sm font-semibold text-[#5C5C6B] transition hover:brightness-95"
                  >
                    {bookingExpanded ? t.showLess : t.showMore}
                  </button>
                </div>
              ) : null}
              <div className="flex justify-center pt-2">{newBookingButton}</div>
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

      {subscriptionModalOpen ? (
        <SubscriptionRequiredModal
          locale={locale}
          title={t.subscriptionRequiredTitle}
          description={t.subscriptionRequiredDescription}
          goToPackagesLabel={t.goToPackages}
          cancelLabel={t.cancel}
          packagesHref={`/${locale}/dashboard/packages`}
          onClose={() => setSubscriptionModalOpen(false)}
        />
      ) : null}
    </>
  );
}
