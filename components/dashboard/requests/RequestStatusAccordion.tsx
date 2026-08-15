"use client";

import { ChevronDown } from "lucide-react";
import { RequestCard } from "@/components/dashboard/requests/RequestCard";
import type {
  DummyRequest,
  RequestStatus,
} from "@/lib/dashboard/dummy-requests";
import type { Locale } from "@/lib/i18n/config";

type RequestStatusAccordionProps = {
  status: RequestStatus;
  title: string;
  items: DummyRequest[];
  locale: Locale;
  open: boolean;
  onToggle: () => void;
  showMore: boolean;
  onToggleShowMore: () => void;
  showMoreLabel: string;
  showLessLabel: string;
  rejectionReasonLabel: string;
  attachmentsLabel: string;
  downloadLabel: string;
  responsesLabel?: string;
};

const VISIBLE_COUNT = 3;

const HEADER_STYLES: Record<RequestStatus, string> = {
  pending: "bg-[#FBF3D8] text-[#8A6D12]",
  approved: "bg-[#DCFCE7] text-[#166534]",
  rejected: "bg-[#FEE2E2] text-[#991B1B]",
};

export function RequestStatusAccordion({
  status,
  title,
  items,
  locale,
  open,
  onToggle,
  showMore,
  onToggleShowMore,
  showMoreLabel,
  showLessLabel,
  rejectionReasonLabel,
  attachmentsLabel,
  downloadLabel,
  responsesLabel,
}: RequestStatusAccordionProps) {
  if (items.length === 0) return null;

  const visible = showMore ? items : items.slice(0, VISIBLE_COUNT);
  const canExpand = items.length > VISIBLE_COUNT;

  return (
    <section className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-sm font-bold transition sm:text-base ${HEADER_STYLES[status]}`}
      >
        <span>
          {title} ({items.length})
        </span>
        <ChevronDown
          className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`}
          strokeWidth={2.25}
        />
      </button>

      {open ? (
        <div className="space-y-3">
          {visible.map((item) => (
            <RequestCard
              key={item.id}
              item={item}
              locale={locale}
              rejectionReasonLabel={rejectionReasonLabel}
              attachmentsLabel={attachmentsLabel}
              downloadLabel={downloadLabel}
              responsesLabel={responsesLabel}
            />
          ))}

          {canExpand ? (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={onToggleShowMore}
                className="rounded-full bg-[#F3EBD2] px-6 py-2 text-sm font-semibold text-[#5C5C6B] transition hover:brightness-95"
              >
                {showMore ? showLessLabel : showMoreLabel}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
