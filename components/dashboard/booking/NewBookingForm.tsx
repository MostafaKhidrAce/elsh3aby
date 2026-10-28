"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Select, {
  components,
  type DropdownIndicatorProps,
  type StylesConfig,
} from "react-select";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock,
  Coins,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import { BookingConfirmModal } from "@/components/dashboard/booking/BookingConfirmModal";
import { ApiError } from "@/lib/api/client";
import { getBookingTypes } from "@/lib/api/catalog";
import {
  checkBookingAvailability,
  createPlaceBooking,
  parseBookingPrice,
} from "@/lib/api/bookings";
import { pickNamed, toApiPhone } from "@/lib/api/localized";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type Option = { value: string; label: string };

type NewBookingFormProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const TEXT = "#170F49";
const BORDER = "#E5E5E5";

const inputClassName =
  "h-12 w-full rounded-[12px] border bg-white px-4 text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#D5AF34] sm:h-14 sm:text-[15px]";

const textareaClassName =
  "min-h-[140px] w-full resize-y rounded-[12px] border bg-white px-4 py-3 text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#D5AF34] sm:text-[15px]";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

function DropdownIndicator(props: DropdownIndicatorProps<Option, false>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 text-[#170F49]" strokeWidth={2} />
    </components.DropdownIndicator>
  );
}

function formatDateLabel(dateKey: string | null, months: string[]) {
  if (!dateKey) return "";
  const [y, m, d] = dateKey.split("-").map(Number);
  if (!y || !m || !d) return dateKey;
  const monthName = months[m - 1] ?? "";
  return `${d} ${monthName} ${y}`;
}

export function NewBookingForm({ locale, dictionary }: NewBookingFormProps) {
  const t = dictionary.dashboard.bookingPage;
  const isAr = locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeSelectId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const dateKey = searchParams.get("date");
  const timeFrom = searchParams.get("from") || "";
  const timeTo = searchParams.get("to") || "";
  const typeParam = searchParams.get("type") || "";
  const slotParam = searchParams.get("slot") || "";
  const priceParam = parseBookingPrice(searchParams.get("price"));

  const { token, user } = useAuth();
  const [typeOptions, setTypeOptions] = useState<Option[]>([]);
  const [typePrices, setTypePrices] = useState<Record<string, number | null>>({});
  const [eventType, setEventType] = useState<Option | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attendees, setAttendees] = useState("");
  const [firstName, setFirstName] = useState("");
  const [mobile, setMobile] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);

  const bookingHref = `/${locale}/dashboard/booking`;
  const dateLabel = formatDateLabel(dateKey, t.months);
  const timeLabel = [timeFrom, timeTo].filter(Boolean).join(" - ");
  const bookingPrice =
    priceParam ?? (eventType ? typePrices[eventType.value] ?? null : null);

  const selectStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: BORDER,
      boxShadow: "none",
      backgroundColor: "#fff",
      "&:hover": { borderColor: BORDER },
      ...(state.isFocused
        ? { borderColor: "#D5AF34", boxShadow: "none" }
        : {}),
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9CA3AF",
      fontWeight: 400,
      fontSize: 14,
    }),
    singleValue: (base) => ({
      ...base,
      color: TEXT,
      fontWeight: 500,
      fontSize: 14,
    }),
    indicatorSeparator: () => ({ display: "none" }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      overflow: "hidden",
      zIndex: 30,
    }),
    option: (base, state) => ({
      ...base,
      fontWeight: 500,
      fontSize: 14,
      color: TEXT,
      backgroundColor: state.isSelected
        ? "#F6EFE7"
        : state.isFocused
          ? "#FBF7F2"
          : "#fff",
      cursor: "pointer",
    }),
  };

  useEffect(() => {
    if (user?.name) setFirstName((current) => current || user.name);
    if (user?.phone) setMobile((current) => current || user.phone || "");
  }, [user]);

  useEffect(() => {
    if (!token) return;
    void getBookingTypes(locale, token).then((items) => {
      const options = items.map((item) => ({
        value: String(item.id),
        label: pickNamed(locale, item),
      }));
      const prices = Object.fromEntries(
        items.map((item) => [String(item.id), parseBookingPrice(item.price)]),
      );
      setTypeOptions(options);
      setTypePrices(prices);
      setEventType((current) => {
        if (current) return current;
        return options.find((option) => option.value === typeParam) ?? options[0] ?? null;
      });
    });
  }, [locale, token, typeParam]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (
      !dateKey ||
      !eventType ||
      !timeFrom ||
      !timeTo ||
      !firstName.trim() ||
      !mobile.trim() ||
      !token
    ) {
      setError(dictionary.common.required);
      return;
    }
    const available = await checkBookingAvailability(dateKey, locale, token, {
      booking_type_id: eventType.value,
    });
    if (!available) {
      setConflictOpen(true);
      return;
    }
    setError("");
    try {
      await createPlaceBooking(
        {
          booking_type_id: Number(eventType.value),
          full_name: firstName.trim(),
          phone: toApiPhone(mobile),
          date_from: dateKey,
          date_to: dateKey,
          time_from: timeFrom,
          time_to: timeTo,
          booking_slot_id: slotParam ? Number(slotParam) : undefined,
          attendees_count: Number(attendees) || undefined,
          additional_notes: notes.trim() || undefined,
          attachment,
        },
        locale,
        token,
      );
      setSuccessOpen(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    }
  }

  const labelClass = "text-[14px] font-bold";
  const fieldGap = "flex flex-col gap-1.5";

  const conflictIcon = (
    <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#E11D48]">
      <AlertCircle className="h-10 w-10 text-white" strokeWidth={2.25} />
    </span>
  );

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <header
          className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="space-y-3">
            <Link
              href={bookingHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#133D3C] transition hover:text-[#D5AF34]"
            >
              <ArrowRight
                className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`}
                strokeWidth={2.25}
              />
              {t.back}
            </Link>
            <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
              {t.formTitle}
            </h1>
          </div>
          <UserMenu locale={locale} dictionary={dictionary} />
        </header>

        <section className={cardClass}>
          <div className="mb-6 flex flex-col gap-3 rounded-[14px] bg-[#F5F5F5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-[#170F49]">
              {dateLabel ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-[#D5AF34]" />
                  {dateLabel}
                </span>
              ) : null}
              {timeLabel ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#D5AF34]" />
                  {timeLabel}
                </span>
              ) : null}
            </div>
            {bookingPrice != null ? (
              <div className="inline-flex items-center gap-2 text-sm font-bold text-[#D5AF34]">
                <Coins className="h-4 w-4" strokeWidth={2} />
                <span>
                  {bookingPrice} {t.currency}
                </span>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.eventType}
                </span>
                <Select<Option, false>
                  inputId={typeSelectId}
                  instanceId={typeSelectId}
                  options={typeOptions}
                  value={eventType}
                  onChange={(option) => setEventType(option)}
                  placeholder={t.eventTypePlaceholder}
                  components={{ DropdownIndicator }}
                  styles={selectStyles}
                  isSearchable={false}
                />
              </label>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.attendees}
                </span>
                <input
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  placeholder={t.attendeesPlaceholder}
                  className={inputClassName}
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </label>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.firstName}
                </span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t.firstNamePlaceholder}
                  className={inputClassName}
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </label>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.mobile}
                </span>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder={t.mobilePlaceholder}
                  className={inputClassName}
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </label>
            </div>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.notes}
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                className={textareaClassName}
                style={{ color: TEXT, borderColor: BORDER }}
              />
            </label>

            <div className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.attachment}
              </span>
              <div
                className="flex flex-wrap items-center gap-3 rounded-[12px] border bg-white px-3 py-2.5"
                style={{ borderColor: BORDER }}
              >
                <span className="min-w-0 flex-1 truncate text-sm text-[#9CA3AF]">
                  {fileName || t.addFile}
                </span>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex shrink-0 items-center rounded-[10px] bg-[#D5AF34] px-3.5 py-2 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  {t.addFile}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setAttachment(file ?? null);
                    setFileName(file?.name ?? "");
                  }}
                />
              </div>
            </div>

            {error ? (
              <p className="text-center text-sm font-medium text-[#E11D48]">
                {error}
              </p>
            ) : null}

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="inline-flex min-w-[220px] items-center justify-center rounded-[12px] bg-[#D5AF34] px-8 py-3.5 text-base font-bold text-white transition hover:brightness-95"
              >
                {t.submit}
              </button>
            </div>
          </form>
        </section>
      </div>

      {successOpen ? (
        <DashboardSuccessModal
          locale={locale}
          title={t.successTitle}
          description={t.successDescription}
          confirmLabel={t.ok}
          onConfirm={() => {
            setSuccessOpen(false);
            router.push(bookingHref);
          }}
        />
      ) : null}

      {conflictOpen ? (
        <BookingConfirmModal
          locale={locale}
          title={t.conflictTitle}
          description={t.conflictDescription}
          icon={conflictIcon}
          primaryLabel={t.retry}
          secondaryLabel={t.cancel}
          onPrimary={() => setConflictOpen(false)}
          onSecondary={() => setConflictOpen(false)}
        />
      ) : null}
    </>
  );
}
