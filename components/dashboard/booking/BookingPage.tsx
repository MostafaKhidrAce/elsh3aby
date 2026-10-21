"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  X,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { BookingStatusCard } from "@/components/dashboard/booking/BookingStatusCard";
import { BookingConfirmModal } from "@/components/dashboard/booking/BookingConfirmModal";
import { BookingPaymentModal } from "@/components/dashboard/booking/BookingPaymentModal";
import {
  cancelPlaceBooking,
  checkBookingAvailability,
  getAvailableBookingDates,
  getBookingStatusItems,
  payPlaceBooking,
} from "@/lib/api/bookings";
import { useAuth } from "@/lib/auth/auth-context";
import { BOOKING_PRICE } from "@/lib/dashboard/dummy-venue-bookings";
import type { BookingStatusItem } from "@/lib/dashboard/dummy-venue-bookings";
import { toDateKey } from "@/lib/dashboard/dummy-events";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type BookingPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildMonthCells(viewMonth: Date): (Date | null)[] {
  const first = startOfMonth(viewMonth);
  const offset = (first.getDay() + 1) % 7;
  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0,
  ).getDate();

  const cells: (Date | null)[] = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

type ModalKind =
  | null
  | "cancel"
  | "cannot_cancel"
  | "conflict"
  | "approved_pay"
  | "payment";

export function BookingPage({ locale, dictionary }: BookingPageProps) {
  const t = dictionary.dashboard.bookingPage;
  const isAr = locale === "ar";
  const router = useRouter();

  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(new Date(2026, 0, 1)),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [preset, setPreset] = useState("last_week");
  const [timeFrom, setTimeFrom] = useState("12:46");
  const [timeTo, setTimeTo] = useState("18:30");
  const [modal, setModal] = useState<ModalKind>(null);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const { token, isReady } = useAuth();
  const [statusItems, setStatusItems] = useState<BookingStatusItem[]>([]);
  const [busyDates, setBusyDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isReady || !token) return;
    const start = toDateKey(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1));
    const end = toDateKey(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0));
    void Promise.all([
      getBookingStatusItems(locale, token),
      getAvailableBookingDates(locale, token, { start_date: start, end_date: end }),
    ]).then(([items, dates]) => {
      setStatusItems(items);
      const available = new Set(dates);
      if (available.size) {
        const busy = new Set<string>();
        const days = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
        for (let day = 1; day <= days; day += 1) {
          const key = toDateKey(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day));
          if (!available.has(key)) busy.add(key);
        }
        setBusyDates(busy);
      }
    });
  }, [isReady, token, locale, viewMonth]);

  const cells = useMemo(() => buildMonthCells(viewMonth), [viewMonth]);
  const monthLabel = `${t.months[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

  const newHrefBase = `/${locale}/dashboard/booking/new`;

  function buildNewHref() {
    const params = new URLSearchParams();
    if (selectedDate) params.set("date", selectedDate);
    if (timeFrom) params.set("from", timeFrom);
    if (timeTo) params.set("to", timeTo);
    const qs = params.toString();
    return qs ? `${newHrefBase}?${qs}` : newHrefBase;
  }

  function shiftMonth(delta: number) {
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1),
    );
  }

  function handlePreset(value: string) {
    setPreset(value);
    const now = new Date();
    if (value === "today" || value === "this_month") {
      setViewMonth(startOfMonth(now));
      setSelectedDate(toDateKey(now));
    } else if (value === "yesterday") {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      setViewMonth(startOfMonth(y));
      setSelectedDate(toDateKey(y));
    } else if (value === "last_month") {
      const m = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      setViewMonth(m);
    } else if (value === "this_year") {
      setViewMonth(new Date(now.getFullYear(), 0, 1));
    } else if (value === "last_year") {
      setViewMonth(new Date(now.getFullYear() - 1, 0, 1));
    }
  }

  async function handleBookNow() {
    if (selectedDate && token) {
      const available = await checkBookingAvailability(selectedDate, locale, token);
      if (!available) {
        setModal("conflict");
        return;
      }
    }
    router.push(buildNewHref());
  }

  function handleCancelBooking(id: string) {
    const item = statusItems.find((b) => b.id === id);
    setActiveBookingId(id);
    setModal(item?.canCancel === false ? "cannot_cancel" : "cancel");
  }

  function handlePayBooking(id: string) {
    setActiveBookingId(id);
    setModal("approved_pay");
  }

  const cancelIcon = (
    <div className="relative inline-flex h-20 w-20 items-center justify-center">
      <span className="absolute -top-1 start-2 h-3 w-0.5 rotate-45 bg-[#170F49]" />
      <span className="absolute -top-1 end-2 h-3 w-0.5 -rotate-45 bg-[#170F49]" />
      <span className="absolute -bottom-1 start-2 h-3 w-0.5 -rotate-45 bg-[#170F49]" />
      <span className="absolute -bottom-1 end-2 h-3 w-0.5 rotate-45 bg-[#170F49]" />
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#E11D48]">
        <X className="h-8 w-8 text-white" strokeWidth={2.5} />
      </span>
    </div>
  );

  const conflictIcon = (
    <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#E11D48]">
      <AlertCircle className="h-10 w-10 text-white" strokeWidth={2.25} />
    </span>
  );

  const successIcon = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/check%20done.svg"
      alt=""
      width={96}
      height={96}
      className="h-24 w-24 object-contain"
      draggable={false}
    />
  );

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
              <Building2 className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
              <span>{t.subtitle}</span>
            </div>
          </div>
          <UserMenu locale={locale} dictionary={dictionary} />
        </header>

        <section className={`${cardClass} space-y-6`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-[#133D3C] sm:text-xl">
              {t.familyBookingTitle}
            </h2>
            <Link
              href={buildNewHref()}
              className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#D5AF34] px-5 py-3 text-sm font-bold text-white transition hover:brightness-95"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              {t.addBooking}
            </Link>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#170F49]">
              {t.availableDays}
            </h3>

            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="order-2 flex flex-col gap-1 rounded-[16px] border border-[#EFEFEF] p-2 lg:order-1">
                {t.presets.map((item) => {
                  const active = preset === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handlePreset(item.value)}
                      className={`rounded-[10px] px-3 py-2.5 text-start text-sm font-semibold transition ${
                        active
                          ? "bg-[#F0F0F0] text-[#170F49]"
                          : "text-[#5C5C6B] hover:bg-[#FAFAFA]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="order-1 rounded-[16px] border border-[#EFEFEF] p-4 sm:p-5 lg:order-2">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => shiftMonth(isAr ? 1 : -1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] text-[#133D3C]"
                    aria-label="Previous month"
                  >
                    {isAr ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </button>
                  <p className="text-sm font-bold text-[#133D3C]">
                    {monthLabel}
                  </p>
                  <button
                    type="button"
                    onClick={() => shiftMonth(isAr ? -1 : 1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] text-[#133D3C]"
                    aria-label="Next month"
                  >
                    {isAr ? (
                      <ChevronLeft className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#9CA3AF]">
                  {t.weekdays.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {cells.map((date, index) => {
                    if (!date) {
                      return <span key={`empty-${index}`} className="h-10" />;
                    }
                    const key = toDateKey(date);
                    const isSelected = key === selectedDate;
                    const hasReservation = busyDates.has(key);

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedDate(key)}
                        className={`inline-flex h-10 items-center justify-center text-sm font-semibold transition ${
                          isSelected
                            ? "rounded-full bg-[#133D3C] text-white"
                            : hasReservation
                              ? "rounded-full border border-[#C4C4C4] text-[#170F49] hover:bg-[#F5F5F5]"
                              : "border-0 bg-transparent text-[#170F49] hover:text-[#D5AF34]"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#F0F0F0] pt-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-wrap items-end gap-3">
                <label className="flex min-w-[120px] flex-col gap-1.5">
                  <span className="sr-only">From</span>
                  <div className="relative">
                    <Clock
                      className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                      strokeWidth={1.75}
                    />
                    <input
                      type="time"
                      value={timeFrom}
                      onChange={(e) => setTimeFrom(e.target.value)}
                      className="h-11 w-full rounded-[10px] border border-[#E5E5E5] bg-white pe-3 ps-10 text-sm font-semibold text-[#170F49] outline-none focus:border-[#D5AF34]"
                    />
                  </div>
                </label>
                <label className="flex min-w-[120px] flex-col gap-1.5">
                  <span className="sr-only">To</span>
                  <div className="relative">
                    <Clock
                      className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                      strokeWidth={1.75}
                    />
                    <input
                      type="time"
                      value={timeTo}
                      onChange={(e) => setTimeTo(e.target.value)}
                      className="h-11 w-full rounded-[10px] border border-[#E5E5E5] bg-white pe-3 ps-10 text-sm font-semibold text-[#170F49] outline-none focus:border-[#D5AF34]"
                    />
                  </div>
                </label>
                <div className="inline-flex items-center gap-2 rounded-[10px] bg-[#FBF6E6] px-3 py-2.5 text-sm">
                  <span className="font-semibold text-[#170F49]">
                    {t.bookingPrice}
                  </span>
                  <span className="font-bold text-[#D5AF34]">
                    {BOOKING_PRICE} {t.currency}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-[10px] bg-[#133D3C] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
                >
                  {t.bookNow}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(null);
                    setTimeFrom("12:46");
                    setTimeTo("18:30");
                  }}
                  className="inline-flex min-w-[100px] items-center justify-center rounded-[10px] border border-[#E5E5E5] bg-white px-5 py-2.5 text-sm font-bold text-[#133D3C] transition hover:bg-[#F5F5F5]"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className={`${cardClass} space-y-4`}>
          <h2 className="text-lg font-bold text-[#133D3C] sm:text-xl">
            {t.statusSection}
          </h2>
          <div className="space-y-4">
            {statusItems.map((booking) => (
              <BookingStatusCard
                key={booking.id}
                booking={booking}
                locale={locale}
                pendingLabel={t.statusPending}
                approvedLabel={t.statusApproved}
                bookedByLabel={t.bookedBy}
                postponeLabel={t.postpone}
                cancelLabel={t.cancel}
                payLabel={t.pay}
                onPostpone={() => undefined}
                onCancel={handleCancelBooking}
                onPay={handlePayBooking}
              />
            ))}
          </div>
        </section>
      </div>

      {modal === "cancel" ? (
        <BookingConfirmModal
          locale={locale}
          title={t.cancelTitle}
          description={t.cancelDescription}
          icon={cancelIcon}
          primaryLabel={t.confirmCancel}
          secondaryLabel={t.ok}
          onPrimary={async () => {
            if (activeBookingId && token) {
              try {
                await cancelPlaceBooking(activeBookingId, locale, token);
                setStatusItems((prev) => prev.filter((item) => item.id !== activeBookingId));
              } catch {
                // keep modal closed even if API rejects the cancel
              }
            }
            setModal(null);
          }}
          onSecondary={() => setModal(null)}
        />
      ) : null}

      {modal === "cannot_cancel" ? (
        <BookingConfirmModal
          locale={locale}
          title={t.cannotCancelTitle}
          description={t.cannotCancelDescription}
          icon={cancelIcon}
          primaryLabel={t.ok}
          secondaryLabel={t.back}
          onPrimary={() => setModal(null)}
          onSecondary={() => setModal(null)}
        />
      ) : null}

      {modal === "conflict" ? (
        <BookingConfirmModal
          locale={locale}
          title={t.conflictTitle}
          description={t.conflictDescription}
          icon={conflictIcon}
          primaryLabel={t.retry}
          secondaryLabel={t.cancel}
          onPrimary={() => setModal(null)}
          onSecondary={() => setModal(null)}
        />
      ) : null}

      {modal === "approved_pay" ? (
        <BookingConfirmModal
          locale={locale}
          title={t.approvedPayTitle}
          description={t.approvedPayDescription}
          icon={successIcon}
          primaryLabel={t.pay}
          secondaryLabel={t.cancel}
          onPrimary={() => setModal("payment")}
          onSecondary={() => setModal(null)}
        />
      ) : null}

      {modal === "payment" ? (
        <BookingPaymentModal
          locale={locale}
          title={t.paymentDeadlineTitle}
          description={t.paymentDeadlineDescription}
          payLabel={t.payWithPrice}
          priceLabel={`${BOOKING_PRICE} ${t.riyal}`}
          onPay={async () => {
            if (activeBookingId && token) {
              try {
                await payPlaceBooking(activeBookingId, locale, token);
              } catch {
                // payment gateway errors stay on the booking list
              }
            }
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      ) : null}
    </>
  );
}
