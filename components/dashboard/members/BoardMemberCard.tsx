"use client";

import { Star } from "lucide-react";
import type { DummyBoardMember } from "@/lib/dashboard/dummy-members";
import type { Locale } from "@/lib/i18n/config";

type BoardMemberCardProps = {
  member: DummyBoardMember;
  locale: Locale;
  votesLabel: string;
  onClick: (id: string) => void;
};

function roleClass(roleKind: DummyBoardMember["roleKind"]) {
  if (roleKind === "president" || roleKind === "vice_president") {
    return "text-[#D5AF34]";
  }
  return "text-[#D5AF34]";
}

export function BoardMemberCard({
  member,
  locale,
  votesLabel,
  onClick,
}: BoardMemberCardProps) {
  const isAr = locale === "ar";
  const name = isAr ? member.name : member.nameEn;
  const role = isAr ? member.role : member.roleEn;

  return (
    <button
      type="button"
      onClick={() => onClick(member.id)}
      className="flex h-full w-full flex-col gap-3 text-start transition hover:opacity-95"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-[17px] bg-[#F5F5F5]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.image}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-2 text-center">
        {member.showMedal ? (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/star-medal%201.svg"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              draggable={false}
            />
          </div>
        ) : null}

        <h3 className="text-[15px] font-bold text-[#170F49] sm:text-[16px]">
          {name}
        </h3>
        <p className={`text-sm font-semibold ${roleClass(member.roleKind)}`}>
          {role}
        </p>

        {member.votePercent != null && member.voteCount != null ? (
          <div className="flex items-center justify-center gap-1.5 text-sm text-[#5C5C6B]">
            <Star className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
            <span className="font-bold text-[#170F49]">
              {member.votePercent}%
            </span>
            <span>
              ({member.voteCount} {votesLabel})
            </span>
          </div>
        ) : null}
      </div>
    </button>
  );
}
