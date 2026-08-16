"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Store } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import type { MarketProduct } from "@/lib/dashboard/dummy-market";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type MarketProductDetailsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  product: MarketProduct;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function MarketProductDetailsPage({
  locale,
  dictionary,
  product,
}: MarketProductDetailsPageProps) {
  const t = dictionary.dashboard.marketPage;
  const isAr = locale === "ar";
  const [imageIndex, setImageIndex] = useState(0);

  const title = isAr ? product.title : product.titleEn;
  const description = isAr ? product.description : product.descriptionEn;
  const category = isAr ? product.category : product.categoryEn;
  const marketHref = `/${locale}/dashboard/market`;
  const buyHref = `/${locale}/dashboard/market/${product.id}/buy`;
  const images = product.images.length > 0 ? product.images : [""];

  return (
    <div className="space-y-4 sm:space-y-5">
      <header
        className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="space-y-3">
          <Link
            href={marketHref}
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
              {t.title}
            </h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#133D3C]">
              <Store className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
              <EventsBreadcrumbs
                items={[
                  { label: t.title, href: marketHref },
                  { label: t.detailsBreadcrumb },
                ]}
              />
            </div>
          </div>
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={`${cardClass} space-y-5`}>
        <div className="overflow-hidden rounded-[18px] bg-[#F5F5F5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[imageIndex]}
            alt=""
            className="aspect-[16/9] w-full object-cover"
          />
        </div>

        {images.length > 1 ? (
          <div className="flex items-center justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Image ${index + 1}`}
                onClick={() => setImageIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === imageIndex ? "bg-[#D5AF34]" : "bg-[#D9D9D9]"
                }`}
              />
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-3">
            <span className="inline-flex rounded-full bg-[#FBF6E6] px-3 py-1 text-xs font-bold text-[#D5AF34]">
              {category}
            </span>
            <h2 className="text-xl font-bold text-[#170F49] sm:text-2xl">
              {title}
            </h2>
          </div>
          <p className="shrink-0 text-lg font-bold text-[#170F49] sm:text-xl">
            {product.price} {t.currencyShort}
          </p>
        </div>

        <div className="space-y-3 text-start">
          {description.split("\n\n").map((paragraph, index) => (
            <p
              key={index}
              className="text-sm leading-7 text-[#4A4A57] sm:leading-8"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Link
            href={buyHref}
            className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-[12px] bg-[#D5AF34] px-8 py-3.5 text-base font-bold text-white transition hover:brightness-95"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={2} />
            {t.buyNow}
          </Link>
        </div>
      </section>
    </div>
  );
}
