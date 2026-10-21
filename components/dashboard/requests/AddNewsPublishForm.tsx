"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Select, {
  components,
  type DropdownIndicatorProps,
  type StylesConfig,
} from "react-select";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import { ApiError } from "@/lib/api/client";
import { getPublishTypes } from "@/lib/api/catalog";
import { createPublishRequest } from "@/lib/api/requests";
import { pickLocalized } from "@/lib/api/localized";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type Option = { value: string; label: string };

type AddNewsPublishFormProps = {
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

export function AddNewsPublishForm({
  locale,
  dictionary,
}: AddNewsPublishFormProps) {
  const t = dictionary.dashboard.requestsPage;
  const isAr = locale === "ar";
  const router = useRouter();
  const typeSelectId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [newsType, setNewsType] = useState<Option | null>(null);
  const [advertiser, setAdvertiser] = useState("");
  const [region, setRegion] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const { token } = useAuth();
  const [typeOptions, setTypeOptions] = useState<Option[]>([]);
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    if (!token) return;
    void getPublishTypes(locale, token)
      .then((items) =>
        setTypeOptions(
          items.map((item) => ({
            value: String(item.id),
            label: pickLocalized(locale, item.name_ar, item.name_en, item.name || ""),
          })),
        ),
      )
      .catch(() => undefined);
  }, [locale, token]);
  const requestsHref = `/${locale}/dashboard/requests`;
  const labelClass = "text-[14px] font-bold";
  const fieldGap = "flex flex-col gap-1.5";

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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!newsType || !advertiser.trim() || !region.trim() || !description.trim() || !token) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    try {
      await createPublishRequest(
        {
          advertiser_name: advertiser.trim(),
          request_type_id: Number(newsType.value),
          region_city: region.trim(),
          event_date: date,
          event_time: time,
          description: description.trim(),
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

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <header
          className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="space-y-3">
            <Link
              href={requestsHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#133D3C] transition hover:text-[#D5AF34]"
            >
              <ArrowRight
                className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`}
                strokeWidth={2.25}
              />
              {t.back}
            </Link>
            <EventsBreadcrumbs
              items={[
                { label: t.title, href: requestsHref },
                { label: t.categoryNews, href: requestsHref },
                { label: t.newsPublishBreadcrumbAdd },
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
            {t.newsPublishFormTitle}
          </h1>

          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.newsPublishType}
                </span>
                <Select<Option, false>
                  inputId={typeSelectId}
                  instanceId={typeSelectId}
                  options={typeOptions}
                  value={newsType}
                  onChange={(option) => setNewsType(option)}
                  placeholder={t.newsPublishTypePlaceholder}
                  isSearchable={false}
                  isRtl={isAr}
                  styles={selectStyles}
                  components={{ DropdownIndicator }}
                />
              </label>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.advertiserName}
                </span>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                    strokeWidth={1.75}
                  />
                  <input
                    required
                    value={advertiser}
                    onChange={(e) => setAdvertiser(e.target.value)}
                    placeholder={t.advertiserNamePlaceholder}
                    className={`${inputClassName} pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                </div>
              </label>
            </div>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.regionCity}
              </span>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                  strokeWidth={1.75}
                />
                <input
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder={t.regionCityPlaceholder}
                  className={`${inputClassName} pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </div>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.newsPublishTime}
                </span>
                <div className="relative">
                  <Clock
                    className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                    strokeWidth={1.75}
                  />
                  <input
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder={t.timePlaceholder}
                    className={`${inputClassName} pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                </div>
              </label>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.newsPublishDate}
                </span>
                <div className="relative">
                  <CalendarDays
                    className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                    strokeWidth={1.75}
                  />
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder={t.newsPublishDatePlaceholder}
                    className={`${inputClassName} pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                </div>
              </label>
            </div>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.newsPublishDescription}
              </span>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.newsPublishDescriptionPlaceholder}
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
                {t.submitRequest}
              </button>
            </div>
          </form>
        </section>
      </div>

      {successOpen ? (
        <DashboardSuccessModal
          locale={locale}
          title={t.newsPublishSuccessTitle}
          description={t.newsPublishSuccessDescription}
          confirmLabel={t.done}
          onConfirm={() => {
            setSuccessOpen(false);
            router.push(requestsHref);
          }}
        />
      ) : null}
    </>
  );
}
