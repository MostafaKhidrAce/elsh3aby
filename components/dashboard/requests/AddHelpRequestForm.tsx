"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, User } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import { ApiError } from "@/lib/api/client";
import { getHelpTypes } from "@/lib/api/catalog";
import { createHelpOrder } from "@/lib/api/requests";
import { toApiPhone } from "@/lib/api/localized";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type AddHelpRequestFormProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const TEXT = "#170F49";
const BORDER = "#E5E5E5";

const inputClassName =
  "h-12 w-full rounded-[12px] border bg-white text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#D5AF34] sm:h-14 sm:text-[15px]";

const textareaClassName =
  "min-h-[140px] w-full resize-y rounded-[12px] border bg-white px-4 py-3 text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#D5AF34] sm:text-[15px]";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function AddHelpRequestForm({
  locale,
  dictionary,
}: AddHelpRequestFormProps) {
  const t = dictionary.dashboard.requestsPage;
  const isAr = locale === "ar";
  const router = useRouter();
  const { token } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [typeId, setTypeId] = useState<number | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [mobile, setMobile] = useState("");
  const [requestTitle, setRequestTitle] = useState("");
  const [description, setDescription] = useState("");
  const [geo, setGeo] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const labelClass = "text-[14px] font-bold";
  const fieldGap = "flex flex-col gap-1.5";

  useEffect(() => {
    if (!token) return;
    void getHelpTypes(locale, token)
      .then((types) => setTypeId(types[0]?.id ?? null))
      .catch(() => undefined);
  }, [locale, token]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (
      !fullName.trim() ||
      !nationalId.trim() ||
      !mobile.trim() ||
      !requestTitle.trim() ||
      !description.trim() ||
      !token
    ) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    try {
      await createHelpOrder(
        {
          type_id: typeId ?? undefined,
          full_name: fullName.trim(),
          national_id: nationalId.trim(),
          geographical_location: geo.trim(),
          request_title: requestTitle.trim(),
          mobile_number: toApiPhone(mobile),
          request_description: description.trim(),
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
              href={`/${locale}/dashboard/requests`}
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
                {
                  label: t.title,
                  href: `/${locale}/dashboard/requests`,
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
            {t.formTitle}
          </h1>

          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
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
                    className={`${inputClassName} border-[#E5E5E5] pl-12 pr-4 ${isAr ? "text-right" : "text-left"}`}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                </div>
              </label>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.nationalId}
                </span>
                <input
                  required
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder={t.nationalIdPlaceholder}
                  className={`${inputClassName} px-4 ${isAr ? "text-right" : "text-left"}`}
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.mobile}
                </span>
                <input
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder={t.mobilePlaceholder}
                  className={`${inputClassName} px-4 ${isAr ? "text-right" : "text-left"}`}
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </label>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.requestTitle}
                </span>
                <input
                  required
                  value={requestTitle}
                  onChange={(e) => setRequestTitle(e.target.value)}
                  placeholder={t.requestTitlePlaceholder}
                  className={`${inputClassName} px-4 ${isAr ? "text-right" : "text-left"}`}
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </label>
            </div>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.requestDescription}
              </span>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.requestDescriptionPlaceholder}
                className={textareaClassName}
                style={{ color: TEXT, borderColor: BORDER }}
              />
            </label>

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
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </div>
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
                  {fileName || t.attachmentPlaceholder}
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
                    const file = e.target.files?.[0] ?? null;
                    setAttachment(file);
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
          title={t.successTitle}
          description={t.successDescription}
          confirmLabel={t.done}
          onConfirm={() => {
            setSuccessOpen(false);
            router.push(`/${locale}/dashboard/requests`);
          }}
        />
      ) : null}
    </>
  );
}
