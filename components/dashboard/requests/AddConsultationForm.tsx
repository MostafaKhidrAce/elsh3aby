"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Select, {
  components,
  type DropdownIndicatorProps,
  type StylesConfig,
} from "react-select";
import { ArrowRight, ChevronDown } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import { ApiError } from "@/lib/api/client";
import { getConsultantTypes } from "@/lib/api/catalog";
import { createConsultation } from "@/lib/api/requests";
import { pickLocalized } from "@/lib/api/localized";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type Option = { value: string; label: string };

type AddConsultationFormProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const TEXT = "#170F49";
const BORDER = "#E5E5E5";

const inputClassName =
  "h-12 w-full rounded-[12px] border bg-white px-4 text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#D5AF34] sm:h-14 sm:text-[15px]";

const textareaClassName =
  "min-h-[160px] w-full resize-y rounded-[12px] border bg-white px-4 py-3 text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#D5AF34] sm:text-[15px]";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

function DropdownIndicator(props: DropdownIndicatorProps<Option, false>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 text-[#170F49]" strokeWidth={2} />
    </components.DropdownIndicator>
  );
}

export function AddConsultationForm({
  locale,
  dictionary,
}: AddConsultationFormProps) {
  const t = dictionary.dashboard.requestsPage;
  const isAr = locale === "ar";
  const router = useRouter();
  const typeSelectId = useId();

  const [consultType, setConsultType] = useState<Option | null>(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const { token } = useAuth();
  const [typeOptions, setTypeOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (!token) return;
    void getConsultantTypes(locale, token)
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
    if (!consultType || !title.trim() || !details.trim() || !token) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    try {
      await createConsultation(
        {
          consultant_type_id: Number(consultType.value),
          title: title.trim(),
          consultation_text: details.trim(),
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
                {
                  label: t.categoryConsult,
                  href: `/${locale}/dashboard/requests`,
                },
                { label: t.consultBreadcrumbAdd },
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
            {t.consultFormTitle}
          </h1>

          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.consultType}
              </span>
              <Select<Option, false>
                inputId={typeSelectId}
                instanceId={typeSelectId}
                options={typeOptions}
                value={consultType}
                onChange={(option) => setConsultType(option)}
                placeholder={t.consultTypePlaceholder}
                isSearchable={false}
                isRtl={isAr}
                styles={selectStyles}
                components={{ DropdownIndicator }}
              />
            </label>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.consultTitle}
              </span>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.consultTitlePlaceholder}
                className={`${inputClassName} ${isAr ? "text-right" : "text-left"}`}
                style={{ color: TEXT, borderColor: BORDER }}
              />
            </label>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.consultDetails}
              </span>
              <textarea
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t.consultDetailsPlaceholder}
                className={textareaClassName}
                style={{ color: TEXT, borderColor: BORDER }}
              />
            </label>

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
          title={t.consultSuccessTitle}
          description={t.consultSuccessDescription}
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
