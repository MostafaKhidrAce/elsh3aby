"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { BoardMemberCard } from "@/components/dashboard/members/BoardMemberCard";
import { MemberDetailsModal } from "@/components/dashboard/members/MemberDetailsModal";
import {
  groupBoardMembers,
  type DummyPreviousBoard,
  type MemberSectionId,
} from "@/lib/dashboard/dummy-members";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type PreviousBoardPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  board: DummyPreviousBoard;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

const SECTION_ORDER: MemberSectionId[] = [
  "president",
  "vice_president",
  "members",
];

const VISIBLE_MEMBERS = 3;

export function PreviousBoardPage({
  locale,
  dictionary,
  board,
}: PreviousBoardPageProps) {
  const t = dictionary.dashboard.membersPage;
  const isAr = locale === "ar";
  const membersHref = `/${locale}/dashboard/members`;
  const title = isAr ? board.title : board.titleEn;

  const [openSections, setOpenSections] = useState<Set<MemberSectionId>>(
    () => new Set(SECTION_ORDER),
  );
  const [showMore, setShowMore] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const grouped = useMemo(
    () => groupBoardMembers(board.members),
    [board.members],
  );

  const sectionLabels: Record<MemberSectionId, string> = {
    president: t.sectionPresident,
    vice_president: t.sectionVice,
    members: t.sectionMembers,
  };

  const selected =
    board.members.find((m) => m.id === selectedId) ?? null;

  function toggleSection(id: MemberSectionId) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <header
          className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="space-y-3">
            <Link
              href={membersHref}
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
              <EventsBreadcrumbs
                items={[
                  { label: t.breadcrumbMembers, href: membersHref },
                  { label: t.breadcrumbPreviousAdmin },
                ]}
              />
            </div>
          </div>
          <UserMenu locale={locale} dictionary={dictionary} />
        </header>

        <section className={`${cardClass} space-y-5`}>
          <div className="rounded-[12px] bg-[#133D3C] px-4 py-3 text-center text-sm font-bold text-white sm:text-base">
            {title}
          </div>

          {SECTION_ORDER.map((sectionId) => {
            const items = grouped[sectionId];
            if (items.length === 0) return null;
            const open = openSections.has(sectionId);
            const visible =
              sectionId === "members" && !showMore
                ? items.slice(0, VISIBLE_MEMBERS)
                : items;
            const canExpand =
              sectionId === "members" && items.length > VISIBLE_MEMBERS;

            return (
              <div key={sectionId} className="space-y-3">
                <button
                  type="button"
                  onClick={() => toggleSection(sectionId)}
                  className="flex w-full items-center justify-between rounded-[12px] bg-[#F6F1E8] px-4 py-3 text-sm font-bold text-[#170F49] transition hover:brightness-95 sm:text-base"
                >
                  <span>{sectionLabels[sectionId]}</span>
                  <ChevronDown
                    className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`}
                    strokeWidth={2.25}
                  />
                </button>

                {open ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {visible.map((member) => (
                        <BoardMemberCard
                          key={member.id}
                          member={member}
                          locale={locale}
                          votesLabel={t.votes}
                          onClick={setSelectedId}
                        />
                      ))}
                    </div>

                    {canExpand ? (
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => setShowMore((v) => !v)}
                          className="rounded-full bg-[#F3EBD2] px-8 py-2.5 text-sm font-semibold text-[#5C5C6B] transition hover:brightness-95"
                        >
                          {showMore ? t.showLess : t.showMore}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
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
