"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Star } from "lucide-react";
import type { DummyBoardMember } from "@/lib/dashboard/dummy-members";
import type { Locale } from "@/lib/i18n/config";

type MemberDetailsModalProps = {
  open: boolean;
  locale: Locale;
  member: DummyBoardMember | null;
  votesLabel: string;
  backLabel: string;
  onClose: () => void;
};

export function MemberDetailsModal({
  open,
  locale,
  member,
  votesLabel,
  backLabel,
  onClose,
}: MemberDetailsModalProps) {
  const isAr = locale === "ar";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open || !member) return null;

  const name = isAr ? member.name : member.nameEn;
  const role = isAr ? member.role : member.roleEn;
  const bio = isAr ? member.bio : member.bioEn;

  return createPortal(
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md sm:p-6">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        dir={isAr ? "rtl" : "ltr"}
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-details-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_20px_50px_rgba(25,33,61,0.2)] sm:rounded-[28px]"
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 sm:px-7 sm:pt-7">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-[#F5F5F5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.image}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <h2
              id="member-details-title"
              className="text-xl font-bold text-[#170F49] sm:text-2xl"
            >
              {name}
            </h2>
            <p className="mt-2 text-sm text-[#6B6B7B]">{role}</p>

            {member.votePercent != null && member.voteCount != null ? (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-sm">
                <Star className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
                <span className="font-bold text-[#170F49]">
                  {member.votePercent}%
                </span>
                <span className="text-[#9CA3AF]">
                  {member.voteCount} {votesLabel}
                </span>
              </div>
            ) : null}

            <div className="mt-5 space-y-3 text-start">
              {bio.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-7 text-[#4A4A57] sm:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 px-5 py-4 sm:px-7 sm:py-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center rounded-[12px] border border-[#D5AF34] bg-white px-4 py-3 text-sm font-bold text-[#133D3C] transition hover:bg-[#FBF6E6]"
          >
            {backLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
