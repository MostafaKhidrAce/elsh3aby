"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, UserRound } from "lucide-react";
import type { DummyNewsComment } from "@/lib/dashboard/dummy-news";
import type { Locale } from "@/lib/i18n/config";

type NewsCommentsModalProps = {
  open: boolean;
  locale: Locale;
  title: string;
  addCommentLabel: string;
  comments: DummyNewsComment[];
  onClose: () => void;
  onAddComment: () => void;
};

export function NewsCommentsModal({
  open,
  locale,
  title,
  addCommentLabel,
  comments,
  onClose,
  onAddComment,
}: NewsCommentsModalProps) {
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

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md">
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
        aria-labelledby="news-comments-title"
        className="relative z-10 flex max-h-[min(90dvh,720px)] w-full max-w-[520px] flex-col rounded-[24px] bg-white shadow-[0_20px_50px_rgba(25,33,61,0.2)]"
      >
        <div className="relative flex items-center justify-center border-b border-[#F0F0F0] px-5 py-4">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute end-4 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E5E5] text-[#133D3C]"
          >
            <ChevronRight
              className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`}
              strokeWidth={2.25}
            />
          </button>
          <h2
            id="news-comments-title"
            className="text-lg font-bold text-[#170F49]"
          >
            {title}
          </h2>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {comments.map((comment) => {
            const author = isAr ? comment.author : comment.authorEn;
            const dateLabel = isAr ? comment.dateLabel : comment.dateLabelEn;
            const text = isAr ? comment.text : comment.textEn;
            return (
              <article key={comment.id} className="space-y-3">
                <p className="text-sm leading-7 text-[#4A4A57]">{text}</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F0F0] text-[#9CA3AF]">
                      <UserRound className="h-4 w-4" />
                    </span>
                    <span className="truncate text-sm font-semibold text-[#170F49]">
                      {author}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-[#9CA3AF]">
                    {dateLabel}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="border-t border-[#F0F0F0] p-4">
          <button
            type="button"
            onClick={onAddComment}
            className="inline-flex w-full items-center justify-center rounded-[12px] bg-[#D5AF34] px-4 py-3 text-sm font-bold text-[#170F49] transition hover:brightness-95"
          >
            {addCommentLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
