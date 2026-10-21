"use client";

import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import {
  Briefcase,
  Filter,
  GraduationCap,
  MoonStar,
  Search,
  Shield,
  Star,
  type LucideProps,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardItemsEmptyState } from "@/components/dashboard/DashboardItemsEmptyState";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import { ExcellenceCard } from "@/components/dashboard/excellence/ExcellenceCard";
import { ExcellenceDetailsModal } from "@/components/dashboard/excellence/ExcellenceDetailsModal";
import {
  ExcellenceFilterModal,
  type ExcellenceFilterValues,
} from "@/components/dashboard/excellence/ExcellenceFilterModal";
import { ExcellencePraiseModal } from "@/components/dashboard/excellence/ExcellencePraiseModal";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { ApiError } from "@/lib/api/client";
import { getExcellenceTypes, type NamedType } from "@/lib/api/catalog";
import {
  getExcellenceCommendations,
  getExcellenceMembers,
  sendExcellenceCommendation,
} from "@/lib/api/excellence";
import { pickLocalized } from "@/lib/api/localized";
import { useAuth } from "@/lib/auth/auth-context";
import {
  EXCELLENCE_AGE_GROUPS,
  EXCELLENCE_BRANCHES,
  EXCELLENCE_YEARS,
  type DummyExcellence,
} from "@/lib/dashboard/dummy-excellence";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type ExcellencePageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const GOLD = "#D5AF34";
const DARK = "#133D3C";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function ExcellencePage({ locale, dictionary }: ExcellencePageProps) {
  const t = dictionary.dashboard.excellencePage;
  const isAr = locale === "ar";

  const { token, isReady, user } = useAuth();
  const [category, setCategory] = useState("all");
  const [types, setTypes] = useState<NamedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<ExcellenceFilterValues>({
    branch: "",
    ageGroup: "",
    year: "",
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [praiseOpen, setPraiseOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [items, setItems] = useState<DummyExcellence[]>([]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [liveTypes, result] = await Promise.all([
        getExcellenceTypes(locale, token),
        getExcellenceMembers(locale, token, {
          search: query.trim() || undefined,
          type_id: category === "all" ? undefined : category,
          family_branch_id: filters.branch || undefined,
          age_category: filters.ageGroup || undefined,
          year: filters.year || undefined,
          per_page: 50,
        }),
      ]);
      setTypes(liveTypes);
      setItems(result.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    } finally {
      setLoading(false);
    }
  }, [token, locale, query, category, filters, dictionary.common.loadError]);

  useEffect(() => {
    if (!isReady || !token) return;
    void load();
  }, [isReady, token, load]);

  const categoryFilters: {
    id: string;
    label: string;
    icon: ComponentType<LucideProps>;
  }[] = [
    { id: "all", label: t.filterAll, icon: Briefcase },
    ...types.map((type) => ({
      id: String(type.id),
      label: pickLocalized(locale, type.name_ar, type.name_en, type.name || ""),
      icon: Star,
    })),
  ];

  const ageLabels: Record<(typeof EXCELLENCE_AGE_GROUPS)[number], string> = {
    youths: t.ageYouths,
    adults: t.ageAdults,
    seniors: t.ageSeniors,
  };

  const branchOptions = EXCELLENCE_BRANCHES.map((value) => ({
    value,
    label: value,
  }));
  const ageOptions = EXCELLENCE_AGE_GROUPS.map((value) => ({
    value,
    label: ageLabels[value],
  }));
  const yearOptions = EXCELLENCE_YEARS.map((value) => ({
    value,
    label: value,
  }));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && String(item.typeId) !== category) return false;
      if (filters.branch && item.branch !== filters.branch) return false;
      if (filters.ageGroup && item.ageGroup !== filters.ageGroup) return false;
      if (filters.year && item.year !== filters.year) return false;
      if (!q) return true;
      return [item.name, item.nameEn, item.title, item.titleEn]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, category, query, filters]);

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return items.find((i) => i.id === selectedId) ?? null;
  }, [items, selectedId]);

  function openDetails(id: string) {
    setSelectedId(id);
    setDetailsOpen(true);
    if (!token) return;
    void getExcellenceCommendations(id, locale, token).then((praises) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, praises } : item)),
      );
    });
  }

  async function handleSendPraise(text: string) {
    if (!selectedId || !token) return;
    try {
      await sendExcellenceCommendation(
        {
          excellence_member_id: Number(selectedId),
          commender_name: user?.name || (isAr ? "عضو" : "Member"),
          commender_phone: user?.phone || undefined,
          commender_email: user?.email || undefined,
          message: text,
        },
        locale,
        token,
      );
      const praises = await getExcellenceCommendations(selectedId, locale, token);
      setItems((prev) =>
        prev.map((item) => (item.id === selectedId ? { ...item, praises } : item)),
      );
      setPraiseOpen(false);
      setDetailsOpen(false);
      setSelectedId(null);
      setSuccessOpen(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    }
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <header
          className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="space-y-1">
            <h1 className="text-xl font-bold sm:text-2xl" style={{ color: DARK }}>
              {t.title}
            </h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#133D3C]">
              <Star className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
              <span>{t.subtitle}</span>
            </div>
          </div>
          <UserMenu locale={locale} dictionary={dictionary} />
        </header>

        <section className={`${cardClass} space-y-6`}>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {categoryFilters.map((filter) => {
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

          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
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
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[10px] border border-[#E8E8E8] bg-white px-5 py-3.5 text-sm font-semibold text-[#170F49] transition hover:border-[#D5AF34]"
            >
              <Filter className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
              {t.filterButton}
            </button>
          </div>

          <DashboardFetchState
            loading={loading}
            error={error}
            loadingLabel={dictionary.common.loading}
            retryLabel={dictionary.common.retry}
            onRetry={() => void load()}
          />

          {!loading && filtered.length === 0 ? (
            <DashboardItemsEmptyState
              title={t.emptyTitle}
              description={t.emptyDescription}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <ExcellenceCard
                  key={item.id}
                  item={item}
                  locale={locale}
                  categoryLabel={item.typeName || t.filterAll}
                  showMoreLabel={t.showMore}
                  onShowMore={openDetails}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <ExcellenceFilterModal
        open={filterOpen}
        locale={locale}
        title={t.filterModalTitle}
        branchLabel={t.filterBranch}
        ageLabel={t.filterAge}
        yearLabel={t.filterYear}
        showResultsLabel={t.showResults}
        branchOptions={branchOptions}
        ageOptions={ageOptions}
        yearOptions={yearOptions}
        values={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {
          setFilters(next);
          setFilterOpen(false);
        }}
      />

      <ExcellenceDetailsModal
        open={detailsOpen}
        locale={locale}
        item={selectedItem}
        categoryLabel={
          selectedItem?.typeName || ""
        }
        praisesTitle={t.praisesTitle}
        sendPraiseLabel={t.sendPraise}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedId(null);
        }}
        onSendPraise={() => setPraiseOpen(true)}
      />

      <ExcellencePraiseModal
        open={praiseOpen}
        locale={locale}
        title={t.praiseModalTitle}
        placeholder={t.praisePlaceholder}
        sendLabel={t.praiseSend}
        cancelLabel={t.praiseCancel}
        onClose={() => setPraiseOpen(false)}
        onSend={handleSendPraise}
      />

      {successOpen ? (
        <DashboardSuccessModal
          locale={locale}
          title={t.praiseSuccessTitle}
          description={t.praiseSuccessDescription}
          confirmLabel={t.ok}
          onConfirm={() => setSuccessOpen(false)}
        />
      ) : null}
    </>
  );
}
