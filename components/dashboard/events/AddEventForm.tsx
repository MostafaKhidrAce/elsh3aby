"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Select, { components, type StylesConfig, type DropdownIndicatorProps } from "react-select";
import {
  User,
  Network,
  Phone,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import { getFamilyBranches } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getEventTypes } from "@/lib/api/catalog";
import { createEvent } from "@/lib/api/events";
import { pickNamed, toApiPhone } from "@/lib/api/localized";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type Option = { value: string; label: string };

type AddEventFormProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const GOLD = "#D5AF34";
const TEXT = "#170F49";
const INPUT_SHADOW = "0px 2px 6px 0px rgba(74, 58, 255, 0.1)";

const inputClassName =
  "h-12 w-full rounded-[12px] border border-[#D5AF34] bg-white text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] sm:h-14 sm:text-[15px]";

const textareaClassName =
  "min-h-[120px] w-full resize-y rounded-[12px] border border-[#D5AF34] bg-white px-4 py-3 text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] sm:text-[15px]";

function DropdownIndicator(props: DropdownIndicatorProps<Option, false>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 text-[#170F49]" strokeWidth={2} />
    </components.DropdownIndicator>
  );
}

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function AddEventForm({ locale, dictionary }: AddEventFormProps) {
  const t = dictionary.dashboard.eventsPage;
  const isAr = locale === "ar";
  const router = useRouter();
  const { token } = useAuth();
  const branchSelectId = useId();
  const typeSelectId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [fullNameAr, setFullNameAr] = useState("");
  const [branch, setBranch] = useState<Option | null>(null);
  const [mobile, setMobile] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [eventType, setEventType] = useState<Option | null>(null);
  const [date, setDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [geo, setGeo] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [branchOptions, setBranchOptions] = useState<Option[]>([]);
  const [typeOptions, setTypeOptions] = useState<Option[]>([]);

  useEffect(() => {
    void getFamilyBranches(locale)
      .then((items) =>
        setBranchOptions(
          items.map((item) => ({
            value: String(item.id),
            label: pickNamed(locale, item),
          })),
        ),
      )
      .catch(() => undefined);
    if (!token) return;
    void getEventTypes(locale, token)
      .then((items) =>
        setTypeOptions(
          items.map((item) => ({
            value: String(item.id),
            label: pickNamed(locale, item),
          })),
        ),
      )
      .catch(() => undefined);
  }, [locale, token]);

  const selectStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: GOLD,
      boxShadow: INPUT_SHADOW,
      backgroundColor: "#fff",
      paddingInlineStart: 36,
      "&:hover": { borderColor: GOLD },
      ...(state.isFocused
        ? { borderColor: GOLD, boxShadow: INPUT_SHADOW }
        : {}),
    }),
    valueContainer: (base) => ({ ...base, paddingInline: 8 }),
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
    input: (base) => ({ ...base, color: TEXT, margin: 0, padding: 0 }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingInline: 12,
      color: TEXT,
    }),
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (
      !fullName.trim() ||
      !fullNameAr.trim() ||
      !branch ||
      !mobile.trim() ||
      !eventType ||
      !date ||
      !token
    ) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await createEvent(
        {
          full_name: fullName.trim(),
          full_name_ar: fullNameAr.trim(),
          family_branch_id: Number(branch.value),
          phone: toApiPhone(mobile),
          event_date_calendar: "gregorian",
          date_from: date,
          date_to: date,
          time_from: timeFrom || "00:00",
          time_to: timeTo || timeFrom || "00:00",
          description: descEn.trim() || descAr.trim(),
          description_ar: descAr.trim() || descEn.trim(),
          location_title: geo.trim(),
          location_address: geo.trim(),
          type_id: Number(eventType.value),
          gallery: files,
        },
        locale,
        token,
      );
      setSuccessOpen(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    } finally {
      setSubmitting(false);
    }
  }

  const labelClass = "text-[14px] font-bold";
  const fieldGap = "flex flex-col gap-1.5";

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <header
          className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="space-y-3">
            <Link
              href={`/${locale}/dashboard/events`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#133D3C] transition hover:text-[#D5AF34]"
            >
              <ArrowRight
                className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`}
                strokeWidth={2.25}
              />
              {t.backToEvents}
            </Link>
            <EventsBreadcrumbs
              items={[
                {
                  label: t.breadcrumbOverview,
                  href: `/${locale}/dashboard/events`,
                },
                {
                  label: t.allEvents,
                  href: `/${locale}/dashboard/events`,
                },
                { label: t.breadcrumbAdd },
              ]}
            />
          </div>
          <UserMenu locale={locale} dictionary={dictionary} />
        </header>

        <section className={cardClass}>
          <h1
            className="mb-6 text-start text-xl font-bold sm:mb-8 sm:text-2xl"
            style={{ color: "#133D3C" }}
          >
            {t.addEventFormTitle}
          </h1>

          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.fullNameAr}
                </span>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                    strokeWidth={1.75}
                  />
                  <input
                    required
                    value={fullNameAr}
                    onChange={(e) => setFullNameAr(e.target.value)}
                    placeholder={t.fullNameArPlaceholder}
                    className={`${inputClassName} pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                    style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
                  />
                </div>
              </label>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.fullName}
                </span>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                    strokeWidth={1.75}
                  />
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className={`${inputClassName} pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                    style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
                    dir="ltr"
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.branch}
                </span>
                <div className="relative">
                  <Network
                    className="pointer-events-none absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                    strokeWidth={1.75}
                  />
                  <Select<Option, false>
                    inputId={branchSelectId}
                    instanceId={branchSelectId}
                    options={branchOptions}
                    value={branch}
                    onChange={(option) => setBranch(option)}
                    placeholder={t.branchPlaceholder}
                    isSearchable={false}
                    isRtl={isAr}
                    styles={selectStyles}
                    components={{ DropdownIndicator }}
                  />
                </div>
              </label>
            </div>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.mobile}
              </span>
              <div className="relative">
                <Phone
                  className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                  strokeWidth={1.75}
                />
                <input
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder={t.mobilePlaceholder}
                  className={`${inputClassName} pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                  style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
                />
              </div>
            </label>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.descAr}
              </span>
              <textarea
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                placeholder={t.descArPlaceholder}
                className={textareaClassName}
                style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
              />
            </label>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.descEn}
              </span>
              <textarea
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder={t.descEnPlaceholder}
                className={textareaClassName}
                style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
                dir="ltr"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.eventType}
                </span>
                <div className="relative">
                  <Select<Option, false>
                    inputId={typeSelectId}
                    instanceId={typeSelectId}
                    options={typeOptions}
                    value={eventType}
                    onChange={(option) => setEventType(option)}
                    placeholder={t.eventTypePlaceholder}
                    isSearchable={false}
                    isRtl={isAr}
                    styles={{
                      ...selectStyles,
                      control: (base, state) => ({
                        ...selectStyles.control!(base, state),
                        paddingInlineStart: 8,
                      }),
                    }}
                    components={{ DropdownIndicator }}
                  />
                </div>
              </label>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.date}
                </span>
                <div className="relative">
                  <Calendar
                    className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                    strokeWidth={1.75}
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`${inputClassName} pl-12 pr-4`}
                    style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.timeFrom}
                </span>
                <div className="relative">
                  <Clock
                    className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                    strokeWidth={1.75}
                  />
                  <input
                    type="time"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    className={`${inputClassName} pl-12 pr-4`}
                    style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
                  />
                </div>
              </label>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.timeTo}
                </span>
                <div className="relative">
                  <Clock
                    className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                    strokeWidth={1.75}
                  />
                  <input
                    type="time"
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                    className={`${inputClassName} pl-12 pr-4`}
                    style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
                  />
                </div>
              </label>
            </div>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.geoLocation}
              </span>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                  strokeWidth={1.75}
                />
                <input
                  value={geo}
                  onChange={(e) => setGeo(e.target.value)}
                  placeholder={t.geoLocationPlaceholder}
                  className={`${inputClassName} pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                  style={{ color: TEXT, boxShadow: INPUT_SHADOW }}
                />
              </div>
            </label>

            <div className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.attachment}
              </span>
              <div
                className="flex flex-wrap items-center gap-3 rounded-[12px] border border-[#D5AF34] bg-white px-3 py-2.5"
                style={{ boxShadow: INPUT_SHADOW }}
              >
                <span className="min-w-0 flex-1 truncate text-sm text-[#9CA3AF]">
                  {files.length ? files.map((file) => file.name).join(", ") : t.attachmentPlaceholder}
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
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    setFiles(Array.from(e.target.files ?? []));
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
                disabled={submitting}
                className="inline-flex min-w-[220px] items-center justify-center rounded-[12px] bg-[#D5AF34] px-8 py-3.5 text-base font-bold text-white transition hover:brightness-95 disabled:opacity-60"
              >
                {submitting ? dictionary.common.loading : t.submitEvent}
              </button>
            </div>
          </form>
        </section>
      </div>

      {successOpen ? (
        <DashboardSuccessModal
          locale={locale}
          title={t.addEventSuccessTitle}
          description={t.addEventSuccessDescription}
          confirmLabel={t.agree}
          onConfirm={() => {
            setSuccessOpen(false);
            router.push(`/${locale}/dashboard/events`);
          }}
        />
      ) : null}
    </>
  );
}
