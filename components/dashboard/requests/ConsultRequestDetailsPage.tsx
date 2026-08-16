"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Clock,
  CreditCard,
  Download,
  FileImage,
  FileText,
  MessageCirclePlus,
  MessagesSquare,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { AddConsultReplyModal } from "@/components/dashboard/requests/AddConsultReplyModal";
import type {
  ConsultReply,
  DummyRequest,
  RequestStatus,
} from "@/lib/dashboard/dummy-requests";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type ConsultRequestDetailsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  item: DummyRequest;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

const PLACEHOLDER_AVATAR = "/placeholder/user-placeholder-img.svg";

const DETAIL_STATUS_STYLES: Record<RequestStatus, string> = {
  pending: "bg-[#FBF3D8] text-[#8A6D12]",
  approved: "bg-[#FFF1E0] text-[#E67E22]",
  rejected: "bg-[#FEE2E2] text-[#DC2626]",
};

export function ConsultRequestDetailsPage({
  locale,
  dictionary,
  item,
}: ConsultRequestDetailsPageProps) {
  const t = dictionary.dashboard.requestsPage;
  const isAr = locale === "ar";
  const requestsHref = `/${locale}/dashboard/requests`;

  const typeLabel =
    (isAr ? item.consultType : item.consultTypeEn) ||
    (isAr ? item.title : item.titleEn);
  const dateLabel = isAr ? item.dateLabel : item.dateLabelEn;
  const description = isAr ? item.description : item.descriptionEn;
  const rejection = isAr ? item.rejectionReason : item.rejectionReasonEn;
  const requestCode = item.requestCode ?? item.id;
  const nationalId = item.nationalId ?? "—";

  const [replies, setReplies] = useState<ConsultReply[]>(item.replies ?? []);
  const [replyModalOpen, setReplyModalOpen] = useState(false);

  const hasResponse =
    replies.length > 0 || Boolean(item.response || item.responseEn);

  const statusLabel =
    item.status === "pending"
      ? t.statusPending
      : item.status === "approved"
        ? t.detailStatusResponded
        : t.statusRejected;

  function handlePublishReply(text: string, fileName?: string) {
    const now = new Date();
    const dateLabelAr = now.toLocaleString("ar-SA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateLabelEn = now.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const next: ConsultReply = {
      id: `local-${Date.now()}`,
      author: "محمد بن عبدالعزيز",
      authorEn: "Mohammed bin Abdulaziz",
      dateLabel: dateLabelAr,
      dateLabelEn,
      text,
      textEn: text,
      attachments: fileName
        ? [
            {
              id: `f-${Date.now()}`,
              name: fileName,
              nameEn: fileName,
              kind: fileName.toLowerCase().endsWith(".pdf") ? "pdf" : "image",
            },
          ]
        : undefined,
    };

    setReplies((prev) => [...prev, next]);
    setReplyModalOpen(false);
    console.log("consult reply", { text, fileName });
  }

  return (
    <>
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
                { label: t.consultBreadcrumbList, href: requestsHref },
                { label: t.consultBreadcrumbDetails },
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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#9CA3AF]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                    <span>{dateLabel}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#5C5C6B]">
                    <CreditCard
                      className="h-4 w-4 shrink-0 text-[#9CA3AF]"
                      strokeWidth={2}
                    />
                    <span>
                      {t.nationalIdShort}: {nationalId}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <p className="text-lg font-bold text-[#170F49]">#{requestCode}</p>
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
              <p className="mt-1.5 text-sm leading-7 text-[#4A4A57]">
                {rejection}
              </p>
            </div>
          ) : null}
        </section>

        {hasResponse ? (
          <section className={`${cardClass} space-y-5`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#170F49] sm:text-lg">
                {t.consultationResponsesTitle}
              </h2>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16A34A] transition hover:brightness-90"
              >
                <Download className="h-4 w-4" strokeWidth={2} />
                {t.downloadAttachments}
              </button>
            </div>

            <div className="space-y-6">
              {replies.map((reply, index) => {
                const author = isAr ? reply.author : reply.authorEn;
                const text = isAr ? reply.text : reply.textEn;
                const replyDate = isAr ? reply.dateLabel : reply.dateLabelEn;
                const isLast = index === replies.length - 1;
                return (
                  <article
                    key={reply.id}
                    className="space-y-3 border-b border-[#F0F0F0] pb-6 last:border-b-0 last:pb-0"
                  >
                    <p className="text-sm leading-8 text-[#4A4A57] sm:text-[15px]">
                      {text}
                    </p>

                    {reply.attachments && reply.attachments.length > 0 ? (
                      <ul className="space-y-2">
                        {reply.attachments.map((file) => {
                          const name = isAr ? file.name : file.nameEn;
                          const isPdf = file.kind === "pdf";
                          return (
                            <li
                              key={file.id}
                              className="flex items-center gap-2 text-sm text-[#4A4A57]"
                            >
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
                    ) : null}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Image
                            src={PLACEHOLDER_AVATAR}
                            alt=""
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <span className="text-sm font-bold text-[#170F49]">
                            {author}
                          </span>
                        </div>
                        <span className="text-xs text-[#9CA3AF] sm:text-sm">
                          {replyDate}
                        </span>
                      </div>

                      {isLast ? (
                        <button
                          type="button"
                          onClick={() => setReplyModalOpen(true)}
                          className="inline-flex shrink-0 items-center gap-2 rounded-[10px] border border-[#D5AF34] bg-white px-5 py-2.5 text-sm font-bold text-[#D5AF34] transition hover:bg-[#FBF6E6]"
                        >
                          <MessageCirclePlus className="h-4 w-4" strokeWidth={2} />
                          {t.addReply}
                        </button>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>

      <AddConsultReplyModal
        open={replyModalOpen}
        locale={locale}
        title={t.addReplyModalTitle}
        placeholderTitle={t.addReplyPlaceholderTitle}
        placeholderBody={t.addReplyPlaceholderBody}
        attachLabel={t.addReplyAttach}
        attachHint={t.addReplyAttachHint}
        publishLabel={t.addReplyPublish}
        backLabel={t.addReplyBack}
        onClose={() => setReplyModalOpen(false)}
        onPublish={handlePublishReply}
      />
    </>
  );
}
