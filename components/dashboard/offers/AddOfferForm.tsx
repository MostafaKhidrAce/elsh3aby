"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Link2, MapPin, User } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import { ApiError } from "@/lib/api/client";
import { getDiscountTypes } from "@/lib/api/catalog";
import { createDiscountOffer } from "@/lib/api/requests";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type AddOfferFormProps = {
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

export function AddOfferForm({ locale, dictionary }: AddOfferFormProps) {
  const t = dictionary.dashboard.requestsPage;
  const isAr = locale === "ar";
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [advertiser, setAdvertiser] = useState("");
  const [store, setStore] = useState("");
  const [title, setTitle] = useState("");
  const [region, setRegion] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [typeId, setTypeId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    void getDiscountTypes(locale, token)
      .then((types) => setTypeId(types[0]?.id ?? null))
      .catch(() => undefined);
  }, [locale, token]);

  const labelClass = "text-[14px] font-bold";
  const fieldGap = "flex flex-col gap-1.5";
  const requestsHref = `/${locale}/dashboard/requests`;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (
      !advertiser.trim() ||
      !store.trim() ||
      !title.trim() ||
      !region.trim() ||
      !description.trim() ||
      !token
    ) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    try {
      await createDiscountOffer(
        {
          advertiser_name: advertiser.trim(),
          store_activity_name: store.trim(),
          discount_type_id: typeId ?? 1,
          region_city: region.trim(),
          start_date: timeFrom,
          end_date: timeTo,
          description: description.trim(),
          redemption_link: link.trim() || undefined,
          offer_title: title.trim(),
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
                { label: t.categoryOffers, href: requestsHref },
                { label: t.offerBreadcrumbAdd },
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
            {t.offerFormTitle}
          </h1>

          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.storeName}
                </span>
                <input
                  required
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  placeholder={t.storeNamePlaceholder}
                  className={`${inputClassName} ${isAr ? "text-right" : "text-left"}`}
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </label>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.offerTitle}
                </span>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.offerTitlePlaceholder}
                  className={`${inputClassName} ${isAr ? "text-right" : "text-left"}`}
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </label>

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
                    type="date"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    className={`${inputClassName} pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                    style={{ color: TEXT, borderColor: BORDER }}
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
                    type="date"
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                    className={`${inputClassName} pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                </div>
              </label>
            </div>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.offerLink}
              </span>
              <div className="relative">
                <Link2
                  className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                  strokeWidth={1.75}
                />
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={t.offerLinkPlaceholder}
                  className={`${inputClassName} pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </div>
            </label>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.offerDescription}
              </span>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.offerDescriptionPlaceholder}
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
          title={t.offerSuccessTitle}
          description={t.offerSuccessDescription}
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
