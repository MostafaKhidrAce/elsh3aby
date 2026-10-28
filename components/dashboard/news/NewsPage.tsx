"use client";

import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import {
  Newspaper,
  Search,
  type LucideProps,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { NewsCard } from "@/components/dashboard/news/NewsCard";
import { DashboardItemsEmptyState } from "@/components/dashboard/DashboardItemsEmptyState";
import { ApiError } from "@/lib/api/client";
import { getNamedTypes, type NamedType } from "@/lib/api/catalog";
import { getNews, type NewsCardView } from "@/lib/api/news";
import { pickNamed } from "@/lib/api/localized";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type NewsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const GOLD = "#D5AF34";
const DARK = "#133D3C";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function NewsPage({ locale, dictionary }: NewsPageProps) {
  const t = dictionary.dashboard.newsPage;
  const { token, isReady } = useAuth();
  const [typeId, setTypeId] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<NamedType[]>([]);
  const [items, setItems] = useState<NewsCardView[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (nextPage = 1, append = false) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const result = await getNews(locale, token, {
          page: nextPage,
          per_page: 15,
          search: query.trim() || undefined,
          type_id: typeId === "all" ? undefined : typeId,
        });
        setItems((prev) => (append ? [...prev, ...result.items] : result.items));
        setPage(result.meta?.current_page ?? nextPage);
        setLastPage(result.meta?.last_page ?? 1);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
      } finally {
        setLoading(false);
      }
    },
    [token, locale, query, typeId, dictionary.common.loadError],
  );

  useEffect(() => {
    if (!isReady || !token) return;
    void getNamedTypes("/news-types", locale, token).then(setTypes).catch(() => setTypes([]));
  }, [isReady, token, locale]);

  useEffect(() => {
    if (!isReady || !token) return;
    void load(1, false);
  }, [isReady, token, load]);

  const filters: { id: string; label: string; icon: ComponentType<LucideProps> }[] = [
    { id: "all", label: t.filterAll, icon: Newspaper },
    ...types.map((type) => ({
      id: String(type.id),
      label: pickNamed(locale, type),
      icon: Newspaper,
    })),
  ];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.title, item.titleEn, item.author, item.authorEn].join(" ").toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <header
        className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" style={{ color: GOLD }} strokeWidth={2} />
          <h1 className="text-xl font-bold sm:text-2xl" style={{ color: DARK }}>
            {t.title}
          </h1>
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={`${cardClass} space-y-6`}>
        {filters.length > 1 ? (
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {filters.map((filter) => {
              const active = typeId === filter.id;
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setTypeId(filter.id)}
                  className={`inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
                    active
                      ? "bg-[#133D3C] text-white shadow-[0_6px_16px_rgba(19,61,60,0.22)]"
                      : "bg-[#F6F1E8] text-[#D5AF34] hover:bg-[#EEE7DA]"
                  }`}
                >
                  <Icon
                    className="h-4 w-4"
                    strokeWidth={2}
                    color={active ? "white" : GOLD}
                  />
                  {filter.label}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="flex w-full justify-center">
          <label className="relative block w-full max-w-md min-w-0">
            <span className="sr-only">{t.searchPlaceholder}</span>
            <Search
              className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF] start-4"
              strokeWidth={2}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="box-border w-full min-w-0 rounded-[10px] border border-[#E8E8E8] bg-[#F5F5F5] py-3.5 pe-4 ps-11 text-sm text-[#170F49] outline-none transition placeholder:text-[#A0A0B0] focus:border-[#D5AF34] focus:bg-white"
            />
          </label>
        </div>

        <DashboardFetchState
          loading={loading && items.length === 0}
          error={error}
          loadingLabel={dictionary.common.loading}
          retryLabel={dictionary.common.retry}
          onRetry={() => void load(1, false)}
        />

        {!loading && visible.length === 0 && !error ? (
          <DashboardItemsEmptyState
            title={t.emptyTitle}
            description={t.emptyDescription}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => (
              <NewsCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        )}

        {page < lastPage ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => void load(page + 1, true)}
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
