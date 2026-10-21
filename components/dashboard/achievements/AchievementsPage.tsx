"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { BookOpen, Search, Star, type LucideProps } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { DashboardItemsEmptyState } from "@/components/dashboard/DashboardItemsEmptyState";
import { AchievementCard } from "@/components/dashboard/achievements/AchievementCard";
import { ApiError } from "@/lib/api/client";
import { getBookCategories, getBooks, type BookCategory } from "@/lib/api/books";
import { pickLocalized } from "@/lib/api/localized";
import { useAuth } from "@/lib/auth/auth-context";
import type { DummyAchievement } from "@/lib/dashboard/dummy-achievements";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type AchievementsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function AchievementsPage({ locale, dictionary }: AchievementsPageProps) {
  const t = dictionary.dashboard.achievementsPage;
  const { token, isReady } = useAuth();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [items, setItems] = useState<DummyAchievement[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [liveCategories, result] = await Promise.all([
        getBookCategories(locale, token),
        getBooks(locale, token, {
          search: query.trim() || undefined,
          category_id: category === "all" ? undefined : category,
          page,
          per_page: 15,
        }),
      ]);
      setCategories(liveCategories);
      setItems((prev) => (page > 1 ? [...prev, ...result.items] : result.items));
      setLastPage(result.meta?.last_page ?? 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    } finally {
      setLoading(false);
    }
  }, [token, locale, query, category, page, dictionary.common.loadError]);

  useEffect(() => {
    if (!isReady || !token) return;
    void load();
  }, [isReady, token, load]);

  const categoryFilters: { id: string; label: string; icon: ComponentType<LucideProps> }[] = [
    { id: "all", label: t.filterAll, icon: BookOpen },
    ...categories.map((item) => ({
      id: String(item.id),
      label: pickLocalized(locale, item.name_ar, item.name_en),
      icon: BookOpen,
    })),
  ];

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
            <Star className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
            <span>{t.subtitle}</span>
          </div>
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={`${cardClass} space-y-5`}>
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {categoryFilters.map((item) => {
            const active = category === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCategory(item.id);
                  setPage(1);
                }}
                className={`inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
                  active
                    ? "bg-[#133D3C] text-white shadow-[0_6px_16px_rgba(19,61,60,0.22)]"
                    : "bg-[#F6F1E8] text-[#D5AF34] hover:bg-[#EEE7DA]"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
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
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={t.searchPlaceholder}
            className="h-12 w-full rounded-[12px] border border-[#E5E5E5] bg-white pe-4 ps-11 text-sm font-medium text-[#170F49] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#D5AF34]"
          />
        </div>

        <DashboardFetchState
          loading={loading}
          error={error}
          loadingLabel={dictionary.common.loading}
          retryLabel={dictionary.common.retry}
          onRetry={() => void load()}
        />

        {!loading && items.length === 0 ? (
          <DashboardItemsEmptyState
            title={t.emptyTitle}
            description={t.emptyDescription}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <AchievementCard
                key={item.id}
                item={item}
                locale={locale}
                writtenByLabel={t.writtenBy}
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
