"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { MarketProduct } from "@/lib/dashboard/dummy-market";
import type { Locale } from "@/lib/i18n/config";

type MarketProductCardProps = {
  product: MarketProduct;
  locale: Locale;
  buyLabel: string;
  currencyLabel: string;
};

export function MarketProductCard({
  product,
  locale,
  buyLabel,
  currencyLabel,
}: MarketProductCardProps) {
  const isAr = locale === "ar";
  const title = isAr ? product.title : product.titleEn;
  const description = isAr
    ? product.shortDescription
    : product.shortDescriptionEn;
  const href = `/${locale}/dashboard/market/${product.id}`;

  return (
    <article className="flex h-full flex-col gap-3">
      <Link href={href} className="group block space-y-3">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-[#F5F5F5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1 text-start">
            <h3 className="text-[15px] font-bold leading-7 text-[#170F49] sm:text-[16px]">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm leading-6 text-[#6B6B7B]">
              {description}
            </p>
          </div>
          <p className="shrink-0 text-sm font-bold text-[#170F49]">
            {product.price} {currencyLabel}
          </p>
        </div>
      </Link>

      <Link
        href={href}
        className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#D5AF34] bg-white px-4 py-2.5 text-sm font-bold text-[#D5AF34] transition hover:bg-[#FBF6E6]"
      >
        <ShoppingCart className="h-4 w-4" strokeWidth={2} />
        {buyLabel}
      </Link>
    </article>
  );
}
