"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, FileText, X } from "lucide-react";
import type { ElectionCandidate } from "@/lib/dashboard/dummy-elections";
import type { Locale } from "@/lib/i18n/config";

type ElectionCandidateModalProps = {
  open: boolean;
  locale: Locale;
  candidate: ElectionCandidate | null;
  achievementsTitle: string;
  downloadLabel: string;
  voteLabel: string;
  onClose: () => void;
  onVote: () => void;
};

export function ElectionCandidateModal({
  open,
  locale,
  candidate,
  achievementsTitle,
  downloadLabel,
  voteLabel,
  onClose,
  onVote,
}: ElectionCandidateModalProps) {
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

  if (!mounted || !open || !candidate) return null;

  const name = isAr ? candidate.name : candidate.nameEn;
  const role = isAr ? candidate.role : candidate.roleEn;
  const bio = isAr ? candidate.bio : candidate.bioEn;

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
        aria-labelledby="election-candidate-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_20px_50px_rgba(25,33,61,0.2)] sm:rounded-[28px]"
      >
        <div className="shrink-0 space-y-3 bg-white px-5 pt-4 sm:px-7 sm:pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] bg-white text-[#133D3C] transition hover:bg-[#F5F5F5]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-[#F5F5F5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={candidate.image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 sm:px-7">
          <div className="flex flex-col items-center text-center">
            <h2
              id="election-candidate-title"
              className="text-xl font-bold text-[#170F49] sm:text-2xl"
            >
              {name}
            </h2>
            <p className="mt-2 text-sm text-[#6B6B7B]">{role}</p>
            <div className="mt-4 space-y-3 text-start">
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

          <div className="mt-5 rounded-[14px] border border-[#E8D9A8] bg-[#FBF6E6] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[#170F49]">
                {achievementsTitle}
              </h3>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16A34A]"
              >
                <Download className="h-4 w-4" strokeWidth={2} />
                {downloadLabel}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {candidate.files.map((file) => {
                const fileName = isAr ? file.name : file.nameEn;
                return (
                  <div
                    key={file.id}
                    className="flex flex-col items-center gap-2 rounded-[10px] bg-white px-2 py-3 text-center"
                  >
                    <FileText
                      className={`h-6 w-6 ${
                        file.kind === "pdf" ? "text-[#EF4444]" : "text-[#2563EB]"
                      }`}
                    />
                    <span className="text-[11px] font-semibold leading-4 text-[#170F49]">
                      {fileName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#F0F0F0] bg-white px-5 py-4 sm:px-7 sm:py-5">
          <button
            type="button"
            onClick={onVote}
            className="inline-flex w-full items-center justify-center rounded-[12px] border border-[#D5AF34] bg-white px-4 py-3 text-sm font-bold text-[#133D3C] transition hover:bg-[#FBF6E6]"
          >
            {voteLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
