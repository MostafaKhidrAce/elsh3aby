"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { ImagePlus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type AddConsultReplyModalProps = {
  open: boolean;
  locale: Locale;
  title: string;
  placeholderTitle: string;
  placeholderBody: string;
  attachLabel: string;
  attachHint: string;
  publishLabel: string;
  backLabel: string;
  onClose: () => void;
  onPublish: (text: string, fileName?: string) => void;
};

export function AddConsultReplyModal({
  open,
  locale,
  title,
  placeholderTitle,
  placeholderBody,
  attachLabel,
  attachHint,
  publishLabel,
  backLabel,
  onClose,
  onPublish,
}: AddConsultReplyModalProps) {
  const isAr = locale === "ar";
  const fileRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setText("");
      setFileName("");
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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    onPublish(text.trim(), fileName || undefined);
  }

  return createPortal(
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0"
        onClick={onClose}
      />
      <form
        dir={isAr ? "rtl" : "ltr"}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consult-add-reply-title"
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[560px] rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(25,33,61,0.2)] sm:rounded-[28px] sm:p-8"
      >
        <h2
          id="consult-add-reply-title"
          className="mb-5 text-center text-lg font-bold text-[#170F49] sm:mb-6 sm:text-xl"
        >
          {title}
        </h2>

        <label className="mb-4 block">
          <span className="sr-only">{placeholderTitle}</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`${placeholderTitle}\n${placeholderBody}`}
            rows={6}
            className="w-full resize-y rounded-[14px] border border-[#E0E0E0] px-4 py-3 text-sm leading-7 text-[#170F49] outline-none placeholder:text-[#A0A0B0] focus:border-[#D5AF34]"
          />
        </label>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mb-6 flex w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#D5D5D5] bg-[#FAFAFA] px-4 py-8 transition hover:border-[#D5AF34] hover:bg-[#FBF8EF]"
        >
          <ImagePlus className="h-8 w-8 text-[#D5AF34]" strokeWidth={1.75} />
          <span className="text-sm font-bold text-[#170F49]">{attachLabel}</span>
          <span className="text-xs text-[#9CA3AF]">
            {fileName || attachHint}
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setFileName(file?.name ?? "");
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            type="submit"
            className="rounded-[12px] bg-[#D5AF34] px-4 py-3 text-sm font-bold text-white transition hover:brightness-95"
          >
            {publishLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] bg-[#F0F0F0] px-4 py-3 text-sm font-bold text-[#170F49] transition hover:bg-[#E8E8E8]"
          >
            {backLabel}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
