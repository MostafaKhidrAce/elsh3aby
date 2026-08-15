"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Gem, MapPin, Plus, Users } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { EventImageSlider } from "@/components/dashboard/events/EventImageSlider";
import { ImageLightbox } from "@/components/dashboard/events/ImageLightbox";
import { AddCommentModal } from "@/components/dashboard/events/AddCommentModal";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import type {
  DummyEvent,
  DummyEventComment,
} from "@/lib/dashboard/dummy-events";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type EventDetailsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  event: DummyEvent;
};

const PLACEHOLDER_AVATAR = "/placeholder/user-placeholder-img.svg";
const GOLD = "#D5AF34";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function EventDetailsPage({
  locale,
  dictionary,
  event,
}: EventDetailsPageProps) {
  const t = dictionary.dashboard.eventsPage;
  const isAr = locale === "ar";

  const [comments, setComments] = useState<DummyEventComment[]>(event.comments);
  const [commentOpen, setCommentOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const title = isAr ? event.detailTitle : event.detailTitleEn;
  const description = isAr ? event.detailDescription : event.detailDescriptionEn;
  const location = isAr ? event.location : event.locationEn;
  const address = isAr ? event.address : event.addressEn;
  const publisher = isAr ? event.publisherName : event.publisherNameEn;
  const branch = isAr ? event.branch : event.branchEn;

  const descriptionParagraphs = useMemo(
    () => description.split(/(?<=\.)\s+/).filter(Boolean),
    [description],
  );

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
                { label: t.breadcrumbDetails },
              ]}
            />
          </div>
          <UserMenu locale={locale} dictionary={dictionary} />
        </header>

        <section className={`${cardClass} space-y-5`}>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#D5AF34]">
              {event.category === "wedding" ? (
                <Gem className="h-4 w-4 text-white" strokeWidth={2} />
              ) : (
                <Users className="h-4 w-4 text-white" strokeWidth={2} />
              )}
            </span>
            <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
              {title}
            </h1>
          </div>

          <EventImageSlider
            images={event.images}
            locale={locale}
            alt={title}
          />

          <div className="space-y-3 text-[14px] font-medium leading-7 text-[#4A4A57] sm:text-[15px]">
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-[#5C5C6B]">
              <div className="flex min-w-0 items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0" style={{ color: GOLD }} />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0" style={{ color: GOLD }} />
                <span>{event.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Image
                src={PLACEHOLDER_AVATAR}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <p className="text-[11px] text-[#9CA3AF]">{t.bookedBy}</p>
                <p className="text-sm font-bold text-[#170F49]">{publisher}</p>
                {branch ? (
                  <span className="mt-1 inline-flex rounded-md bg-[#F4E8C0] px-2 py-0.5 text-[11px] font-semibold text-[#D5AF34]">
                    {branch}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h2 className="text-base font-bold text-[#D5AF34] sm:text-lg">
              {t.eventAddressTitle}
            </h2>
            <p className="text-sm font-semibold text-[#4A4A57] sm:text-[15px]">
              {address}
            </p>
            {event.mapEmbedUrl ? (
              <div className="overflow-hidden rounded-[16px] border border-[#EAEAEA]">
                <iframe
                  title={t.eventAddressTitle}
                  src={event.mapEmbedUrl}
                  className="h-[280px] w-full border-0 sm:h-[340px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className={`${cardClass} space-y-5`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-[#133D3C] sm:text-xl">
              {t.commentsTitle}
            </h2>
            <button
              type="button"
              onClick={() => setCommentOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#D5AF34] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              {t.addComment}
            </button>
          </div>

          <ul className="divide-y divide-[#F0F0F0]">
            {comments.map((comment) => {
              const author = isAr ? comment.author : comment.authorEn;
              const dateLabel = isAr ? comment.dateLabel : comment.dateLabelEn;
              const text = isAr ? comment.text : comment.textEn;
              return (
                <li key={comment.id} className="space-y-3 py-5 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <Image
                      src={PLACEHOLDER_AVATAR}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#170F49]">{author}</p>
                      <p className="text-xs text-[#9CA3AF] sm:text-sm">
                        {dateLabel}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-[#5C5C6B] sm:text-[15px]">
                    {text}
                  </p>
                  {comment.images.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {comment.images.map((src) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setLightboxSrc(src)}
                          className="overflow-hidden rounded-[12px] border border-[#EAEAEA]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt=""
                            className="h-24 w-24 object-cover sm:h-28 sm:w-28"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <AddCommentModal
        open={commentOpen}
        locale={locale}
        title={t.addCommentModalTitle}
        placeholder={t.commentPlaceholder}
        attachHint={t.attachFileHint}
        attachFormats={t.attachFileFormats}
        publishLabel={t.publishComment}
        reviewLabel={t.reviewComment}
        onClose={() => setCommentOpen(false)}
        onPublish={({ text, fileNames }) => {
          const now = new Date();
          const newComment: DummyEventComment = {
            id: `local-${Date.now()}`,
            author: isAr ? "أنت" : "You",
            authorEn: "You",
            dateLabel: now.toLocaleString(isAr ? "ar-SA" : "en-GB"),
            dateLabelEn: now.toLocaleString("en-GB"),
            text: text || (isAr ? "تمت إضافة مرفق" : "Attachment added"),
            textEn: text || "Attachment added",
            images: fileNames.length
              ? [
                  "https://images.unsplash.com/photo-1519167758481-83f29da8c2b4?w=400&q=80",
                ]
              : [],
          };
          setComments((prev) => [newComment, ...prev]);
          setCommentOpen(false);
          setSuccessOpen(true);
        }}
      />

      {successOpen ? (
        <DashboardSuccessModal
          locale={locale}
          title={t.commentSuccessTitle}
          description={t.commentSuccessDescription}
          confirmLabel={t.ok}
          onConfirm={() => setSuccessOpen(false)}
        />
      ) : null}

      <ImageLightbox
        src={lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />
    </>
  );
}
