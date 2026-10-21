"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  CircleArrowLeft,
  Plus,
  Vote,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import { ElectionCandidateCard } from "@/components/dashboard/elections/ElectionCandidateCard";
import { ElectionCandidateModal } from "@/components/dashboard/elections/ElectionCandidateModal";
import {
  castVote,
  getActiveElection,
  getElectionCandidates,
  type ElectionView,
} from "@/lib/api/elections";
import { useAuth } from "@/lib/auth/auth-context";
import {
  ELECTION_ROLE_ORDER,
  type ElectionCandidate,
  type ElectionRoleId,
} from "@/lib/dashboard/dummy-elections";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type ElectionsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdown(deadline: Date): Countdown {
  const diff = Math.max(0, deadline.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function ElectionsPage({ locale, dictionary }: ElectionsPageProps) {
  const t = dictionary.dashboard.electionsPage;
  const { token, isReady } = useAuth();
  const [election, setElection] = useState<ElectionView | null>(null);
  const [candidates, setCandidates] = useState<ElectionCandidate[]>([]);
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [openSections, setOpenSections] = useState<Set<ElectionRoleId>>(
    () => new Set(ELECTION_ROLE_ORDER),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [voteSuccessOpen, setVoteSuccessOpen] = useState(false);

  useEffect(() => {
    if (!isReady || !token) return;
    void getActiveElection(locale, token).then(async (live) => {
      setElection(live);
      if (!live) return;
      setCountdown(getCountdown(live.deadline ?? new Date()));
      setCandidates(await getElectionCandidates(live.id, locale, token));
    });
  }, [isReady, token, locale]);

  useEffect(() => {
    const deadline = election?.deadline;
    if (!deadline) return;
    const id = window.setInterval(() => {
      setCountdown(getCountdown(deadline));
    }, 1000);
    return () => window.clearInterval(id);
  }, [election?.deadline]);

  const grouped = useMemo(
    () => ({
      president: candidates.filter((item) => item.roleId === "president"),
      vice_president: candidates.filter((item) => item.roleId === "vice_president"),
      member: candidates.filter((item) => item.roleId === "member"),
    }),
    [candidates],
  );
  const selected = selectedId
    ? (candidates.find((item) => item.id === selectedId) ?? null)
    : null;
  const ELECTIONS_PHASE = election?.phase ?? "vote";
  const ELECTION_STATS = election?.stats ?? {
    president: 0,
    vicePresident: 0,
    member: 0,
  };

  const sectionLabels: Record<ElectionRoleId, string> = {
    president: t.sectionPresident,
    vice_president: t.sectionVice,
    member: t.sectionMembers,
  };

  const previousHref = `/${locale}/dashboard/members?tab=previous`;
  const nominateHref = `/${locale}/dashboard/elections/nominate`;

  function toggleSection(id: ElectionRoleId) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openDetails(id: string) {
    setSelectedId(id);
    setDetailsOpen(true);
  }

  async function handleVote(id?: string) {
    const candidateId = id ?? selectedId;
    if (!token || !election || !candidateId) return;
    const candidate = candidates.find((item) => item.id === candidateId);
    try {
      await castVote(
        {
          election_id: election.id,
          candidate_id: Number(candidateId),
          position: candidate?.roleId || "member",
        },
        locale,
        token,
      );
      if (id) setSelectedId(id);
      setDetailsOpen(false);
      setVoteSuccessOpen(true);
    } catch {
      setVoteSuccessOpen(true);
    }
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
              <Vote className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
              <span>{t.subtitle}</span>
            </div>
          </div>
          <UserMenu locale={locale} dictionary={dictionary} />
        </header>

        <section className={`${cardClass} space-y-6`}>
          <div className="flex flex-col gap-4 rounded-[16px] bg-[#F6F1E8] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0 flex-1 space-y-3">
              <p className="text-sm font-semibold leading-7 text-[#170F49] sm:text-[15px]">
                {t.countdownTitle}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-lg font-bold text-[#133D3C] sm:text-xl">
                <span>
                  {countdown.days} {t.days}
                </span>
                <span>
                  {countdown.hours} {t.hours}
                </span>
                <span>
                  {countdown.minutes} {t.minutes}
                </span>
                <span>
                  {countdown.seconds} {t.seconds}
                </span>
              </div>
            </div>
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#D5AF34]/20 sm:flex">
              <Vote className="h-8 w-8 text-[#D5AF34]" strokeWidth={1.75} />
            </div>
          </div>

          <Link
            href={previousHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#133D3C] transition hover:text-[#D5AF34]"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#D5AF34] text-[#D5AF34]">
              <CircleArrowLeft
                className={`h-3.5 w-3.5 ${locale === "ar" ? "" : "rotate-180"}`}
                strokeWidth={2.25}
              />
            </span>
            {t.previousBoardsLink}
          </Link>

          {ELECTIONS_PHASE === "nominate" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[16px] border border-[#EFEFEF] bg-white p-5 text-center shadow-[0_4px_16px_rgba(25,33,61,0.04)]">
                  <p className="text-3xl font-bold text-[#133D3C]">
                    {ELECTION_STATS.president}
                  </p>
                  <p className="mt-2 text-sm text-[#5C5C6B]">{t.statPresident}</p>
                </div>
                <div className="rounded-[16px] border border-[#EFEFEF] bg-white p-5 text-center shadow-[0_4px_16px_rgba(25,33,61,0.04)]">
                  <p className="text-3xl font-bold text-[#133D3C]">
                    {ELECTION_STATS.vicePresident}
                  </p>
                  <p className="mt-2 text-sm text-[#5C5C6B]">{t.statVice}</p>
                </div>
                <div className="rounded-[16px] border border-[#EFEFEF] bg-white p-5 text-center shadow-[0_4px_16px_rgba(25,33,61,0.04)] sm:col-span-2">
                  <p className="text-3xl font-bold text-[#133D3C]">
                    {ELECTION_STATS.member}
                  </p>
                  <p className="mt-2 text-sm text-[#5C5C6B]">{t.statMember}</p>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <Link
                  href={nominateHref}
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#D5AF34] px-8 py-3.5 text-sm font-bold text-white transition hover:brightness-95"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  {t.nominateCta}
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-5">
              {ELECTION_ROLE_ORDER.map((roleId) => {
                const items = grouped[roleId];
                if (items.length === 0) return null;
                const open = openSections.has(roleId);
                return (
                  <div key={roleId} className="space-y-3">
                    <button
                      type="button"
                      onClick={() => toggleSection(roleId)}
                      className="flex w-full items-center justify-between rounded-[12px] bg-[#F6F1E8] px-4 py-3 text-sm font-bold text-[#170F49] transition hover:brightness-95 sm:text-base"
                    >
                      <span>{sectionLabels[roleId]}</span>
                      <ChevronDown
                        className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`}
                        strokeWidth={2.25}
                      />
                    </button>
                    {open ? (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {items.map((candidate) => (
                          <ElectionCandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            locale={locale}
                            votesLabel={t.votes}
                            voteLabel={t.vote}
                            onOpen={openDetails}
                            onVote={handleVote}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <div className="flex justify-center pt-2">
                <Link
                  href={nominateHref}
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#D5AF34] px-8 py-3.5 text-sm font-bold text-white transition hover:brightness-95"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  {t.nominateCta}
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>

      <ElectionCandidateModal
        open={detailsOpen}
        locale={locale}
        candidate={selected}
        achievementsTitle={t.achievementsTitle}
        downloadLabel={t.download}
        voteLabel={t.vote}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedId(null);
        }}
        onVote={() => handleVote()}
      />

      {voteSuccessOpen ? (
        <DashboardSuccessModal
          locale={locale}
          title={t.voteSuccessTitle}
          description={t.voteSuccessDescription}
          confirmLabel={t.ok}
          onConfirm={() => setVoteSuccessOpen(false)}
        />
      ) : null}
    </>
  );
}
