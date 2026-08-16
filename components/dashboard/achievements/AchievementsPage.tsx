"use client";

import { useMemo, useState, type ComponentType } from "react";
import {
  BookOpen,
  FlaskConical,
  Globe2,
  Lamp,
  Search,
  Star,
  type LucideProps,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardItemsEmptyState } from "@/components/dashboard/DashboardItemsEmptyState";
import { AchievementCard } from "@/components/dashboard/achievements/AchievementCard";
import {
  DUMMY_ACHIEVEMENTS,
  type AchievementCategoryId,
} from "@/lib/dashboard/dummy-achievements";
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
  const [category, setCategory] = useState<AchievementCategoryId>("all");
  const [query, setQuery] = useState("");

  const categoryFilters: {
    id: AchievementCategoryId;
    label: string;
    icon: ComponentType<LucideProps>;
  }[] = [
    { id: "all", label: t.filterAll, icon: BookOpen },
    { id: "scientific", label: t.filterScientific, icon: FlaskConical },
    { id: "communal", label: t.filterCommunal, icon: Globe2 },
    { id: "religious", label: t.filterReligious, icon: Lamp },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DUMMY_ACHIEVEMENTS.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return [
        item.title,
        item.titleEn,
        item.author,
        item.authorEn,
        item.badge,
        item.badgeEn,
        item.branch,
        item.branchEn,
      ]
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
                onClick={() => setCategory(item.id)}
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-12 w-full rounded-[12px] border border-[#E5E5E5] bg-white pe-4 ps-11 text-sm font-medium text-[#170F49] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#D5AF34]"
          />
        </div>

        {filtered.length === 0 ? (
          <DashboardItemsEmptyState
            title={t.emptyTitle}
            description={t.emptyDescription}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <AchievementCard
                key={item.id}
                item={item}
                locale={locale}
                writtenByLabel={t.writtenBy}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
