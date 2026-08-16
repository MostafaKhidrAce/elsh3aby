"use client";

import { useMemo, useState } from "react";
import { Search, Store } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardItemsEmptyState } from "@/components/dashboard/DashboardItemsEmptyState";
import { MarketProductCard } from "@/components/dashboard/market/MarketProductCard";
import { OfferCard } from "@/components/dashboard/offers/OfferCard";
import { DUMMY_MARKET_PRODUCTS } from "@/lib/dashboard/dummy-market";
import { DUMMY_OFFERS } from "@/lib/dashboard/dummy-offers";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type MarketPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

type TabId = "market" | "offers";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function MarketPage({ locale, dictionary }: MarketPageProps) {
  const t = dictionary.dashboard.marketPage;
  const offersT = dictionary.dashboard.requestsPage;
  const [tab, setTab] = useState<TabId>("market");
  const [query, setQuery] = useState("");

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DUMMY_MARKET_PRODUCTS.filter((product) => {
      if (!q) return true;
      return [
        product.title,
        product.titleEn,
        product.shortDescription,
        product.shortDescriptionEn,
        product.category,
        product.categoryEn,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query]);

  const offers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DUMMY_OFFERS.filter((offer) => {
      if (!q) return true;
      return [
        offer.title,
        offer.titleEn,
        offer.description,
        offer.descriptionEn,
        offer.location,
        offer.locationEn,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query]);

  const items = tab === "market" ? products : offers;
  const empty =
    tab === "market"
      ? { title: t.emptyTitle, description: t.emptyDescription }
      : {
          title: offersT.offersEmptyTitle,
          description: offersT.offersEmptyDescription,
        };

  return (
    <div className="space-y-4 sm:space-y-5">
      <header
        className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
            {t.title}
          </h1>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#133D3C]">
            <Store className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
            <span>{t.subtitle}</span>
          </div>
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={`${cardClass} space-y-5`}>
        <div className="flex w-full items-center gap-1 rounded-[999px] bg-[#F6F1E8] p-1.5">
          {(
            [
              { id: "market" as const, label: t.tabMarket },
              { id: "offers" as const, label: t.tabOffers },
            ] as const
          ).map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex-1 rounded-[999px] px-3 py-3 text-center text-sm font-bold transition sm:px-5 sm:text-base ${
                  active
                    ? "bg-[#133D3C] text-white shadow-[0_6px_16px_rgba(19,61,60,0.22)]"
                    : "bg-transparent text-[#D5AF34] hover:bg-[#EEE7DA]/60"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 start-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
            strokeWidth={2}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-12 w-full rounded-[12px] border border-[#E5E5E5] bg-[#FAFAFA] pe-4 ps-11 text-sm font-medium text-[#170F49] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#D5AF34] focus:bg-white"
          />
        </div>

        {items.length === 0 ? (
          <DashboardItemsEmptyState
            title={empty.title}
            description={empty.description}
          />
        ) : tab === "market" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <MarketProductCard
                key={product.id}
                product={product}
                locale={locale}
                buyLabel={t.buyNow}
                currencyLabel={t.currency}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                locale={locale}
                getOfferLabel={offersT.getOffer}
                couponLabel={offersT.couponLabel}
                copiedLabel={offersT.copied}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
