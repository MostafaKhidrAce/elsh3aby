"use client";

import { useMemo, useState, type ComponentType } from "react";
import {
  BookOpen,
  FlaskConical,
  Newspaper,
  Search,
  Users,
  type LucideProps,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { NewsCard } from "@/components/dashboard/news/NewsCard";
import {
  DUMMY_NEWS,
  type NewsCategoryId,
} from "@/lib/dashboard/dummy-news";
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
  const [category, setCategory] = useState<NewsCategoryId>("all");
  const [query, setQuery] = useState("");

  const filters: {
    id: NewsCategoryId;
    label: string;
    icon: ComponentType<LucideProps>;
  }[] = [
    { id: "all", label: t.filterAll, icon: Newspaper },
    { id: "scientific", label: t.filterScientific, icon: FlaskConical },
    { id: "community", label: t.filterCommunity, icon: Users },
    { id: "religious", label: t.filterReligious, icon: BookOpen },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DUMMY_NEWS.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return [item.title, item.titleEn, item.author, item.authorEn]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [category, query]);

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
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {filters.map((filter) => {
            const active = category === filter.id;
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setCategory(filter.id)}
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

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-lg font-bold text-[#170F49]">{t.emptyTitle}</h2>
            <p className="mt-2 text-sm text-[#6B7280]">{t.emptyDescription}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <NewsCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
