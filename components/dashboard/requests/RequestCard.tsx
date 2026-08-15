"use client";

import { ClipboardList, Clock, Download, FileImage, FileText } from "lucide-react";
import type { DummyRequest } from "@/lib/dashboard/dummy-requests";
import type { Locale } from "@/lib/i18n/config";

type RequestCardProps = {
  item: DummyRequest;
  locale: Locale;
  rejectionReasonLabel: string;
  attachmentsLabel: string;
  downloadLabel: string;
  responsesLabel?: string;
};

const STATUS_BORDER: Record<DummyRequest["status"], string> = {
  pending: "#E8C547",
  approved: "#22C55E",
  rejected: "#EF4444",
};

export function RequestCard({
  item,
  locale,
  rejectionReasonLabel,
  attachmentsLabel,
  downloadLabel,
  responsesLabel,
}: RequestCardProps) {
  const isAr = locale === "ar";
  const title = isAr ? item.title : item.titleEn;
  const dateLabel = isAr ? item.dateLabel : item.dateLabelEn;
  const rejection = isAr ? item.rejectionReason : item.rejectionReasonEn;
  const description = isAr ? item.description : item.descriptionEn;
  const consultType = isAr ? item.consultType : item.consultTypeEn;
  const response = isAr ? item.response : item.responseEn;
  const borderColor = STATUS_BORDER[item.status];

  return (
    <article
      className="rounded-[20px] border border-[#EAEAEA] bg-white p-4 shadow-[0_4px_16px_rgba(25,33,61,0.05)] sm:p-5"
      style={{ borderInlineStartWidth: 5, borderInlineStartColor: borderColor }}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#F6F1E8]">
          <ClipboardList className="h-5 w-5 text-[#D5AF34]" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          {consultType ? (
            <p className="mb-1 text-xs font-semibold text-[#D5AF34]">
              {consultType}
            </p>
          ) : null}
          <h3 className="text-base font-bold text-[#170F49] sm:text-[17px]">
            {title}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#9CA3AF] sm:text-sm">
            <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span>{dateLabel}</span>
          </div>
        </div>
      </div>

      {description ? (
        <p className="mt-3 text-sm leading-7 text-[#4A4A57]">{description}</p>
      ) : null}

      {response ? (
        <div className="mt-4 border-t border-[#F0F0F0] pt-4">
          <p className="text-sm font-bold text-[#170F49]">
            {responsesLabel ?? "Responses"}
          </p>
          <p className="mt-1.5 text-sm leading-7 text-[#4A4A57]">{response}</p>
        </div>
      ) : null}

      {rejection ? (
        <div className="mt-4 border-t border-[#F0F0F0] pt-4">
          <p className="text-sm font-semibold text-[#9CA3AF]">
            {rejectionReasonLabel}
          </p>
          <p className="mt-1.5 text-sm leading-7 text-[#4A4A57]">{rejection}</p>
        </div>
      ) : null}

      {item.attachments && item.attachments.length > 0 ? (
        <div className="mt-4 border-t border-[#F0F0F0] pt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[#170F49]">{attachmentsLabel}</h4>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16A34A] transition hover:brightness-90"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
              {downloadLabel}
            </button>
          </div>
          <ul className="space-y-2">
            {item.attachments.map((file) => {
              const name = isAr ? file.name : file.nameEn;
              const isPdf = file.kind === "pdf";
              return (
                <li key={file.id} className="flex items-center gap-2 text-sm text-[#4A4A57]">
                  {isPdf ? (
                    <FileText className="h-4 w-4 shrink-0 text-[#EF4444]" />
                  ) : (
                    <FileImage className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                  )}
                  <span>{name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
