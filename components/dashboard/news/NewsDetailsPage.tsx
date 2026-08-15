"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronUp, Newspaper, Share2 } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { EventImageSlider } from "@/components/dashboard/events/EventImageSlider";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import { NewsCommentsModal } from "@/components/dashboard/news/NewsCommentsModal";
import { NewsAddCommentModal } from "@/components/dashboard/news/NewsAddCommentModal";
import type {
  DummyNewsComment,
  DummyNewsItem,
} from "@/lib/dashboard/dummy-news";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type NewsDetailsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  item: DummyNewsItem;
};

const PLACEHOLDER_AVATAR = "/placeholder/user-placeholder-img.svg";
const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function NewsDetailsPage({
  locale,
  dictionary,
  item,
}: NewsDetailsPageProps) {
  const t = dictionary.dashboard.newsPage;
  const isAr = locale === "ar";

  const [comments, setComments] = useState<DummyNewsComment[]>(item.comments);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const title = isAr ? item.title : item.titleEn;
  const dateLabel = isAr ? item.dateLabel : item.dateLabelEn;
  const author = isAr ? item.author : item.authorEn;
  const body = isAr ? item.body : item.bodyEn;
  const quote = isAr ? item.quote : item.quoteEn;

  const paragraphs = useMemo(
    () => body.split(/(?<=\.)\s+/).filter(Boolean),
    [body],
  );

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <header
          className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="space-y-3">
            <Link
              href={`/${locale}/dashboard/news`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#133D3C] transition hover:text-[#D5AF34]"
            >
              <ArrowRight
                className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`}
                strokeWidth={2.25}
              />
              {t.backToNews}
            </Link>
            <EventsBreadcrumbs
              items={[
                {
                  label: t.breadcrumbOverview,
                  href: `/${locale}/dashboard/news`,
                },
                {
                  label: t.allNews,
                  href: `/${locale}/dashboard/news`,
                },
                { label: t.breadcrumbDetails },
              ]}
            />
          </div>
          <UserMenu locale={locale} dictionary={dictionary} />
        </header>

        <section className={`${cardClass} space-y-5 overflow-hidden !p-0`}>
          <div className="space-y-5 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#D5AF34]">
                <Newspaper className="h-4 w-4 text-white" strokeWidth={2} />
              </span>
              <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
                {t.title}
              </h1>
            </div>

            <EventImageSlider
              images={item.images}
              locale={locale}
              alt={title}
            />

            <div className="space-y-3">
              <p className="text-sm text-[#9CA3AF]">{dateLabel}</p>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold leading-8 text-[#170F49] sm:text-xl">
                  {title}
                </h2>
                <button
                  type="button"
                  aria-label="Share"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] text-[#133D3C]"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <Image
                  src={PLACEHOLDER_AVATAR}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-[11px] text-[#9CA3AF]">{t.publishedBy}</p>
                  <p className="text-sm font-bold text-[#170F49]">{author}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-[14px] font-medium leading-7 text-[#4A4A57] sm:text-[15px]">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 28)}>{paragraph}</p>
              ))}
              {quote ? (
                <blockquote className="border-s-4 border-[#D5AF34] ps-4 text-[#170F49]">
                  {quote}
                </blockquote>
              ) : null}
            </div>
          </div>

          {/* Comments stay collapsed until popup — no inline list */}
          <button
            type="button"
            onClick={() => setCommentsOpen(true)}
            className="flex w-full items-center justify-center gap-2 border-t border-[#F0F0F0] bg-[#F7F7F7] px-4 py-4 text-sm font-semibold text-[#133D3C] transition hover:bg-[#F0F0F0]"
          >
            <ChevronUp className="h-4 w-4" strokeWidth={2.25} />
            {t.showAllComments}
          </button>
        </section>
      </div>

      <NewsCommentsModal
        open={commentsOpen}
        locale={locale}
        title={t.commentsTitle}
        addCommentLabel={t.addComment}
        comments={comments}
        onClose={() => setCommentsOpen(false)}
        onAddComment={() => {
          setCommentsOpen(false);
          setAddOpen(true);
        }}
      />

      <NewsAddCommentModal
        open={addOpen}
        locale={locale}
        title={t.addCommentModalTitle}
        label={t.writeCommentLabel}
        placeholder={t.commentPlaceholder}
        publishLabel={t.publishComment}
        reviewLabel={t.reviewComment}
        onClose={() => setAddOpen(false)}
        onPublish={(text) => {
          const now = new Date();
          const newComment: DummyNewsComment = {
            id: `local-${Date.now()}`,
            author: isAr ? "أنت" : "You",
            authorEn: "You",
            dateLabel: now.toLocaleString(isAr ? "ar-SA" : "en-GB"),
            dateLabelEn: now.toLocaleString("en-GB"),
            text,
            textEn: text,
          };
          setComments((prev) => [newComment, ...prev]);
          setAddOpen(false);
          setSuccessOpen(true);
        }}
      />

      {successOpen ? (
        <DashboardSuccessModal
          locale={locale}
          title={t.commentSuccessTitle}
          description={t.commentSuccessDescription}
          confirmLabel={t.ok}
          onConfirm={() => {
            setSuccessOpen(false);
            setCommentsOpen(true);
          }}
        />
      ) : null}
    </>
  );
}
