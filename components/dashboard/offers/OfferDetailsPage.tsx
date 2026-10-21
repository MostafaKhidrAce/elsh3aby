"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { OfferClaimButton } from "@/components/dashboard/offers/OfferClaimButton";
import type { DummyOffer } from "@/lib/dashboard/dummy-offers";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type OfferDetailsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  offer: DummyOffer;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function OfferDetailsPage({
  locale,
  dictionary,
  offer,
}: OfferDetailsPageProps) {
  const t = dictionary.dashboard.requestsPage;
  const isAr = locale === "ar";
  const title = isAr ? offer.title : offer.titleEn;
  const description = isAr ? offer.description : offer.descriptionEn;
  const validity = isAr ? offer.validityLabel : offer.validityLabelEn;
  const location = isAr ? offer.location : offer.locationEn;
  const requestsHref = `/${locale}/dashboard/requests`;

  return (
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
              { label: t.categoryOffers },
            ]}
          />
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={cardClass}>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="relative mb-5 aspect-[21/9] w-full overflow-hidden rounded-[16px] bg-[#F5F5F5] sm:mb-6 sm:rounded-[20px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={offer.image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <p className="mb-3 text-[13px] text-[#9CA3AF] sm:text-sm">
            {validity}
          </p>

          <h1 className="mb-4 text-xl font-bold text-[#170F49] sm:text-2xl lg:text-[28px]">
            {title}
          </h1>

          <p className="mb-5 max-w-2xl text-sm leading-7 text-[#6B6B7B] sm:text-[15px] sm:leading-8">
            {description}
          </p>

          <div className="mb-8 flex items-center justify-center gap-1.5 text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-[#EF4444]" strokeWidth={2} />
            <span className="text-[#5C5C6B]">{location}</span>
          </div>

          <OfferClaimButton
            offerId={offer.id}
            couponCode={offer.couponCode}
            getOfferLabel={t.getOffer}
            couponLabel={t.couponLabel}
            copiedLabel={t.copied}
            size="lg"
            locale={locale}
          />
        </div>
      </section>
    </div>
  );
}
