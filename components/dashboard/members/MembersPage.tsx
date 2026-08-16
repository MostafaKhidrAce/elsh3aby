"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Users } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardItemsEmptyState } from "@/components/dashboard/DashboardItemsEmptyState";
import { MemberCard } from "@/components/dashboard/members/MemberCard";
import { MemberDetailsModal } from "@/components/dashboard/members/MemberDetailsModal";
import { PreviousBoardCard } from "@/components/dashboard/members/PreviousBoardCard";
import {
  CURRENT_BOARD_MEMBERS,
  PREVIOUS_BOARDS,
  getMemberById,
} from "@/lib/dashboard/dummy-members";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type MembersPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

type TabId = "current" | "previous";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

function parseTab(value: string | null): TabId {
  return value === "previous" ? "previous" : "current";
}

function MembersPageInner({ locale, dictionary }: MembersPageProps) {
  const t = dictionary.dashboard.membersPage;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TabId>(() =>
    parseTab(searchParams.get("tab")),
  );
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredCurrent = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CURRENT_BOARD_MEMBERS.filter((member) => {
      if (!q) return true;
      return [member.name, member.nameEn, member.role, member.roleEn]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query]);

  const selected = selectedId ? (getMemberById(selectedId) ?? null) : null;

  function changeTab(next: TabId) {
    setTab(next);
    setQuery("");
    const href =
      next === "previous"
        ? `/${locale}/dashboard/members?tab=previous`
        : `/${locale}/dashboard/members`;
    router.replace(href, { scroll: false });
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <header
          className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
              {t.title}
            </h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#133D3C]">
              <Users className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
              <span>
                {tab === "current" ? t.breadcrumbMembers : t.breadcrumbPrevious}
              </span>
            </div>
          </div>
          <UserMenu locale={locale} dictionary={dictionary} />
        </header>

        <section className={`${cardClass} space-y-6`}>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {(
              [
                { id: "current" as const, label: t.tabCurrent },
                { id: "previous" as const, label: t.tabPrevious },
              ] as const
            ).map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeTab(item.id)}
                  className={`inline-flex items-center rounded-[10px] px-5 py-2.5 text-sm font-semibold transition sm:px-6 ${
                    active
                      ? "bg-[#133D3C] text-white shadow-[0_6px_16px_rgba(19,61,60,0.22)]"
                      : "bg-[#F6F1E8] text-[#170F49] hover:bg-[#EEE7DA]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {tab === "current" ? (
            <>
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

              {filteredCurrent.length === 0 ? (
                <DashboardItemsEmptyState
                  title={t.emptyTitle}
                  description={t.emptyDescription}
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredCurrent.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      locale={locale}
                      onClick={setSelectedId}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {PREVIOUS_BOARDS.map((board) => (
                <PreviousBoardCard
                  key={board.id}
                  board={board}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <MemberDetailsModal
        open={Boolean(selected)}
        locale={locale}
        member={selected}
        votesLabel={t.votes}
        backLabel={t.back}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}

export function MembersPage(props: MembersPageProps) {
  return (
    <Suspense fallback={null}>
      <MembersPageInner {...props} />
    </Suspense>
  );
}
