"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ImagePlus, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type AddCommentModalProps = {
  open: boolean;
  locale: Locale;
  title: string;
  placeholder: string;
  attachHint: string;
  attachFormats: string;
  publishLabel: string;
  reviewLabel: string;
  onClose: () => void;
  onPublish: (payload: { text: string; files: File[] }) => void;
};

export function AddCommentModal({
  open,
  locale,
  title,
  placeholder,
  attachHint,
  attachFormats,
  publishLabel,
  reviewLabel,
  onClose,
  onPublish,
}: AddCommentModalProps) {
  const isAr = locale === "ar";
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!open) {
      setText("");
      setFiles([]);
    }
  }, [open]);

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
        aria-labelledby="add-comment-title"
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
          id="add-comment-title"
          className="mb-5 text-center text-lg font-bold text-[#170F49] sm:text-xl"
        >
          {title}
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="mb-4 w-full resize-y rounded-[14px] border border-[#E5E5E5] px-4 py-3 text-sm text-[#170F49] outline-none placeholder:text-[#A0A0B0] focus:border-[#D5AF34]"
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mb-5 flex w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#D5AF34]/70 bg-[#FBF8F0] px-4 py-6 text-center transition hover:bg-[#F6EFE7]"
        >
          <ImagePlus className="h-8 w-8 text-[#D5AF34]" strokeWidth={1.75} />
          <span className="text-sm font-semibold text-[#D5AF34]">
            {attachHint}
          </span>
          <span className="text-xs text-[#9CA3AF]">{attachFormats}</span>
          {files.length > 0 ? (
            <span className="mt-1 text-xs font-medium text-[#133D3C]">
              {files.map((file) => file.name).join(", ")}
            </span>
          ) : null}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          multiple
          className="hidden"
          onChange={(e) => {
            setFiles(Array.from(e.target.files ?? []));
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              if (!text.trim() && files.length === 0) return;
              onPublish({ text: text.trim(), files });
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
