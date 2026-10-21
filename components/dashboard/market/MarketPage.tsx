"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Store } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { DashboardItemsEmptyState } from "@/components/dashboard/DashboardItemsEmptyState";
import { MarketProductCard } from "@/components/dashboard/market/MarketProductCard";
import { OfferCard } from "@/components/dashboard/offers/OfferCard";
import { ApiError } from "@/lib/api/client";
import { getDiscountOffers } from "@/lib/api/requests";
import { getProducts } from "@/lib/api/shop";
import { useAuth } from "@/lib/auth/auth-context";
import type { MarketProduct } from "@/lib/dashboard/dummy-market";
import type { DummyOffer } from "@/lib/dashboard/dummy-offers";
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
  const { token, isReady } = useAuth();
  const [tab, setTab] = useState<TabId>("market");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [offers, setOffers] = useState<DummyOffer[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      if (tab === "market") {
        const result = await getProducts(locale, token, {
          search: query.trim() || undefined,
          page,
          per_page: 15,
        });
        setProducts((prev) => (page > 1 ? [...prev, ...result.items] : result.items));
        setLastPage(result.meta?.last_page ?? 1);
      } else {
        const result = await getDiscountOffers(locale, token, {
          search: query.trim() || undefined,
          page,
          per_page: 15,
        });
        setOffers((prev) => (page > 1 ? [...prev, ...result.items] : result.items));
        setLastPage(result.meta?.last_page ?? 1);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    } finally {
      setLoading(false);
    }
  }, [token, locale, tab, query, page, dictionary.common.loadError]);

  useEffect(() => {
    if (!isReady || !token) return;
    void load();
  }, [isReady, token, load]);

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
          <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">{t.title}</h1>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#133D3C]">
            <Store className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
            <span>{tab === "market" ? t.tabMarket : t.tabOffers}</span>
          </div>
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={`${cardClass} space-y-6`}>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {(["market", "offers"] as TabId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setPage(1);
              }}
              className={`rounded-[10px] px-5 py-2.5 text-sm font-semibold transition ${
                tab === id
                  ? "bg-[#133D3C] text-white"
                  : "bg-[#F6F1E8] text-[#D5AF34]"
              }`}
            >
              {id === "market" ? t.tabMarket : t.tabOffers}
            </button>
          ))}
        </div>

        <div className="flex w-full justify-center">
          <label className="relative block w-full max-w-md min-w-0">
            <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF] start-4" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={t.searchPlaceholder}
              className="box-border w-full min-w-0 rounded-[10px] border border-[#E8E8E8] bg-[#F5F5F5] py-3.5 pe-4 ps-11 text-sm text-[#170F49] outline-none"
            />
          </label>
        </div>

        <DashboardFetchState
          loading={loading}
          error={error}
          loadingLabel={dictionary.common.loading}
          retryLabel={dictionary.common.retry}
          onRetry={() => void load()}
        />

        {!loading && items.length === 0 ? (
          <DashboardItemsEmptyState title={empty.title} description={empty.description} />
        ) : tab === "market" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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

        {page < lastPage ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setPage((value) => value + 1)}
              className="rounded-full bg-[#F3EBD2] px-8 py-2.5 text-sm font-semibold text-[#5C5C6B]"
            >
              {dictionary.common.loadMore}
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
