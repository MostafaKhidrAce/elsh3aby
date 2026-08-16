"use client";

import { Star } from "lucide-react";
import type { ElectionCandidate } from "@/lib/dashboard/dummy-elections";
import type { Locale } from "@/lib/i18n/config";

type ElectionCandidateCardProps = {
  candidate: ElectionCandidate;
  locale: Locale;
  votesLabel: string;
  voteLabel: string;
  onOpen: (id: string) => void;
  onVote: (id: string) => void;
};

export function ElectionCandidateCard({
  candidate,
  locale,
  votesLabel,
  voteLabel,
  onOpen,
  onVote,
}: ElectionCandidateCardProps) {
  const isAr = locale === "ar";
  const name = isAr ? candidate.name : candidate.nameEn;
  const role = isAr ? candidate.role : candidate.roleEn;

  return (
    <article className="flex h-full flex-col gap-3">
      <button
        type="button"
        onClick={() => onOpen(candidate.id)}
        className="flex w-full flex-col gap-3 text-start transition hover:opacity-95"
      >
        <div className="aspect-[4/3] w-full overflow-hidden rounded-[17px] bg-[#F5F5F5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={candidate.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            {candidate.showMedal ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logos/star-medal%201.svg"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
                draggable={false}
              />
            ) : null}
            <h3 className="text-[15px] font-bold text-[#170F49] sm:text-[16px]">
              {name}
            </h3>
          </div>
          <p className="text-sm font-semibold text-[#D5AF34]">{role}</p>
          <div className="flex items-center justify-center gap-1.5 text-sm text-[#5C5C6B]">
            <Star className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
            <span className="font-bold text-[#170F49]">
              {candidate.votePercent}%
            </span>
            <span>
              ({candidate.voteCount} {votesLabel})
            </span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onVote(candidate.id)}
        className="mt-auto inline-flex w-full items-center justify-center rounded-[10px] border border-[#D5AF34] bg-white px-4 py-2.5 text-sm font-bold text-[#D5AF34] transition hover:bg-[#FBF6E6]"
      >
        {voteLabel}
      </button>
    </article>
  );
}
