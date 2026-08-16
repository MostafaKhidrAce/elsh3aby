"use client";

import type { DummyBoardMember } from "@/lib/dashboard/dummy-members";
import type { Locale } from "@/lib/i18n/config";

type MemberCardProps = {
  member: DummyBoardMember;
  locale: Locale;
  onClick: (id: string) => void;
};

function roleClass(roleKind: DummyBoardMember["roleKind"]) {
  if (roleKind === "president" || roleKind === "vice_president") {
    return "text-[#D5AF34]";
  }
  if (roleKind === "committee_head") {
    return "text-[#170F49]";
  }
  return "text-[#9CA3AF]";
}

export function MemberCard({ member, locale, onClick }: MemberCardProps) {
  const isAr = locale === "ar";
  const name = isAr ? member.name : member.nameEn;
  const role = isAr ? member.role : member.roleEn;
  const dateRange = isAr ? member.dateRange : member.dateRangeEn;

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
      <div className="space-y-1.5 text-center">
        <h3 className="text-[15px] font-bold text-[#170F49] sm:text-[16px]">
          {name}
        </h3>
        <p className={`text-sm font-semibold ${roleClass(member.roleKind)}`}>
          {role}
        </p>
        <p className="text-xs text-[#9CA3AF] sm:text-sm">{dateRange}</p>
      </div>
    </button>
  );
}
