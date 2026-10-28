"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Download, Star } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { EventImageSlider } from "@/components/dashboard/events/EventImageSlider";
import { AchievementGalleryModal } from "@/components/dashboard/achievements/AchievementGalleryModal";
import type { DummyAchievement } from "@/lib/dashboard/dummy-achievements";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type AchievementDetailsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  item: DummyAchievement;
};

const PLACEHOLDER_AVATAR = "/placeholder/user-placeholder-img.svg";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function AchievementDetailsPage({
  locale,
  dictionary,
  item,
}: AchievementDetailsPageProps) {
  const t = dictionary.dashboard.achievementsPage;
  const isAr = locale === "ar";
  const [galleryOpen, setGalleryOpen] = useState(false);

  const title = isAr ? item.title : item.titleEn;
  const description = isAr ? item.description : item.descriptionEn;
  const badge = isAr ? item.badge : item.badgeEn;
  const author = isAr ? item.author : item.authorEn;
  const authorImage = item.authorImage || PLACEHOLDER_AVATAR;
  const listHref = `/${locale}/dashboard/achievements`;
  const images = item.images.filter(Boolean);

  function handleDownload() {
    if (item.fileUrl && images.length <= 1) {
      window.open(item.fileUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (images.length > 0) {
      setGalleryOpen(true);
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
            href={listHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#133D3C] transition hover:text-[#D5AF34]"
          >
            <ArrowRight
              className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`}
              strokeWidth={2.25}
            />
            {t.back}
          </Link>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
              {t.overviewTitle}
            </h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#133D3C]">
              <Star className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
              <EventsBreadcrumbs
                items={[
                  { label: t.breadcrumb, href: listHref },
                  { label: t.detailsBreadcrumb },
                ]}
              />
            </div>
          </div>
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={`${cardClass} space-y-5`}>
        <EventImageSlider images={images} locale={locale} alt={title} />

        <div className="space-y-3 text-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF6E6] px-3 py-1 text-xs font-bold text-[#D5AF34]">
            <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
            {badge}
          </span>
          <h2 className="text-xl font-bold text-[#170F49] sm:text-2xl">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#9CA3AF]">{t.writtenBy}:</span>
            <Image
              src={authorImage}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="text-sm font-bold text-[#170F49]">{author}</span>
          </div>
          <p className="text-sm leading-7 text-[#4A4A57] sm:leading-8">
            {description}
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-[12px] bg-[#D5AF34] px-8 py-3.5 text-base font-bold text-white transition hover:brightness-95"
          >
            <Download className="h-5 w-5" strokeWidth={2} />
            {t.downloadFile}
          </button>
        </div>
      </section>
    </div>
    <AchievementGalleryModal
      open={galleryOpen}
      locale={locale}
      title={t.downloadFile}
      images={images}
      onClose={() => setGalleryOpen(false)}
    />
    </>
  );
}
