"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type NewsAddCommentModalProps = {
  open: boolean;
  locale: Locale;
  title: string;
  label: string;
  placeholder: string;
  publishLabel: string;
  reviewLabel: string;
  onClose: () => void;
  onPublish: (text: string) => void;
};

export function NewsAddCommentModal({
  open,
  locale,
  title,
  label,
  placeholder,
  publishLabel,
  reviewLabel,
  onClose,
  onPublish,
}: NewsAddCommentModalProps) {
  const isAr = locale === "ar";
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setText("");
      return;
    }
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
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md">
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
        aria-labelledby="news-add-comment-title"
        className="relative z-10 w-full max-w-[520px] rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(25,33,61,0.2)] sm:p-8"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 end-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] text-[#133D3C]"
        >
          <X className="h-4 w-4" />
        </button>

        <h2
          id="news-add-comment-title"
          className="mb-5 text-center text-lg font-bold text-[#170F49] sm:text-xl"
        >
          {title}
        </h2>

        <label className="mb-4 flex flex-col gap-1.5">
          <span className="text-sm font-bold text-[#170F49]">{label}</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            rows={5}
            className="w-full resize-y rounded-[14px] border border-[#333] px-4 py-3 text-sm text-[#170F49] outline-none placeholder:text-[#A0A0B0] focus:border-[#D5AF34]"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              if (!text.trim()) return;
              onPublish(text.trim());
            }}
            className="rounded-full bg-[#D5AF34] px-4 py-3 text-sm font-bold text-[#170F49] transition hover:brightness-95"
          >
            {publishLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#F0F0F0] px-4 py-3 text-sm font-bold text-[#170F49] transition hover:bg-[#E8E8E8]"
          >
            {reviewLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
