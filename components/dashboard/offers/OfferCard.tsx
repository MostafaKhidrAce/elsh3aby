"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { OfferClaimButton } from "@/components/dashboard/offers/OfferClaimButton";
import type { DummyOffer } from "@/lib/dashboard/dummy-offers";
import type { Locale } from "@/lib/i18n/config";

type OfferCardProps = {
  offer: DummyOffer;
  locale: Locale;
  getOfferLabel: string;
  couponLabel: string;
  copiedLabel: string;
};

export function OfferCard({
  offer,
  locale,
  getOfferLabel,
  couponLabel,
  copiedLabel,
}: OfferCardProps) {
  const isAr = locale === "ar";
  const title = isAr ? offer.title : offer.titleEn;
  const description = isAr ? offer.description : offer.descriptionEn;
  const dateLabel = isAr ? offer.dateLabel : offer.dateLabelEn;
  const location = isAr ? offer.location : offer.locationEn;
  const href = `/${locale}/dashboard/offers/${offer.id}`;

  return (
    <article className="flex h-full flex-col gap-3">
      <Link href={href} className="group block space-y-3">
        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[20px] bg-[#F5F5F5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={offer.image}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
        <p className="text-[12px] text-[#9CA3AF] sm:text-[13px]">{dateLabel}</p>
        <h3 className="line-clamp-2 text-start text-[15px] font-bold leading-7 text-[#170F49] sm:text-[16px]">
          {title}
        </h3>
        <p className="line-clamp-2 text-start text-sm leading-6 text-[#6B6B7B]">
          {description}
        </p>
        <div className="flex items-center gap-1.5 text-sm text-[#EF4444]">
          <MapPin className="h-4 w-4 shrink-0" strokeWidth={2} />
          <span className="truncate text-[#5C5C6B]">{location}</span>
        </div>
      </Link>

      <div className="mt-auto">
        <OfferClaimButton
          offerId={offer.id}
          couponCode={offer.couponCode}
          getOfferLabel={getOfferLabel}
          couponLabel={couponLabel}
          copiedLabel={copiedLabel}
        />
      </div>
    </article>
  );
}
