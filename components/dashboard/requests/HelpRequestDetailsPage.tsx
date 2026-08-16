"use client";

import {
  Clock,
  CreditCard,
  Download,
  FileImage,
  FileText,
  MessagesSquare,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import type { DummyRequest, RequestStatus } from "@/lib/dashboard/dummy-requests";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type HelpRequestDetailsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  item: DummyRequest;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

const DETAIL_STATUS_STYLES: Record<RequestStatus, string> = {
  pending: "bg-[#FBF3D8] text-[#8A6D12]",
  approved: "bg-[#FFF1E0] text-[#E67E22]",
  rejected: "bg-[#FEE2E2] text-[#DC2626]",
};

export function HelpRequestDetailsPage({
  locale,
  dictionary,
  item,
}: HelpRequestDetailsPageProps) {
  const t = dictionary.dashboard.requestsPage;
  const isAr = locale === "ar";
  const requestsHref = `/${locale}/dashboard/requests`;

  const typeLabel =
    (isAr ? item.typeLabel : item.typeLabelEn) ||
    (isAr ? item.title : item.titleEn);
  const dateLabel = isAr ? item.dateLabel : item.dateLabelEn;
  const description = isAr ? item.description : item.descriptionEn;
  const rejection = isAr ? item.rejectionReason : item.rejectionReasonEn;
  const requestCode = item.requestCode ?? item.id;
  const nationalId = item.nationalId ?? "—";

  const statusLabel =
    item.status === "pending"
      ? t.statusPending
      : item.status === "approved"
        ? t.detailStatusResponded
        : t.statusRejected;

  return (
    <div className="space-y-4 sm:space-y-5">
      <header
        className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
            {t.title}
          </h1>
          <EventsBreadcrumbs
            items={[
              { label: t.categoryHelp, href: requestsHref },
              { label: t.breadcrumbDetails },
            ]}
          />
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={`${cardClass} space-y-5`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F6F1E8]">
              <MessagesSquare
                className="h-5 w-5 text-[#D5AF34]"
                strokeWidth={2}
              />
            </span>
            <div className="min-w-0 space-y-2">
              <span className="inline-flex rounded-full bg-[#F3F4F6] px-3 py-1 text-sm font-semibold text-[#133D3C]">
                {typeLabel}
              </span>
              <div className="flex items-center gap-1.5 text-sm text-[#9CA3AF]">
                <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                <span>{dateLabel}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-start sm:text-end">
            <p className="text-lg font-bold text-[#170F49]">#{requestCode}</p>
            <div className="inline-flex items-center gap-1.5 text-sm text-[#5C5C6B]">
              <CreditCard className="h-4 w-4 shrink-0 text-[#9CA3AF]" strokeWidth={2} />
              <span>
                {t.nationalIdShort}: {nationalId}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[#170F49]">
            {t.statusLabel}
          </span>
          <span
            className={`inline-flex rounded-full px-3.5 py-1.5 text-sm font-bold ${DETAIL_STATUS_STYLES[item.status]}`}
          >
            {statusLabel}
          </span>
        </div>

        {description ? (
          <p className="text-sm leading-8 text-[#4A4A57] sm:text-[15px]">
            {description}
          </p>
        ) : null}

        {rejection ? (
          <div className="rounded-[12px] border border-[#FEE2E2] bg-[#FFF8F8] p-4">
            <p className="text-sm font-semibold text-[#9CA3AF]">
              {t.rejectionReason}
            </p>
            <p className="mt-1.5 text-sm leading-7 text-[#4A4A57]">{rejection}</p>
          </div>
        ) : null}
      </section>

      {item.attachments && item.attachments.length > 0 ? (
        <section className={`${cardClass} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[#170F49] sm:text-lg">
              {t.attachments}
            </h2>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16A34A] transition hover:brightness-90"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
              {t.downloadAttachments}
            </button>
          </div>

          <ul className="space-y-3">
            {item.attachments.map((file) => {
              const name = isAr ? file.name : file.nameEn;
              const isPdf = file.kind === "pdf";
              return (
                <li
                  key={file.id}
                  className="flex items-center gap-2.5 text-sm text-[#4A4A57]"
                >
                  {isPdf ? (
                    <FileText className="h-5 w-5 shrink-0 text-[#EF4444]" />
                  ) : (
                    <FileImage className="h-5 w-5 shrink-0 text-[#3B82F6]" />
                  )}
                  <span>{name}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
