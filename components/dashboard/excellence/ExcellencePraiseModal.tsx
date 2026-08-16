"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n/config";

type ExcellencePraiseModalProps = {
  open: boolean;
  locale: Locale;
  title: string;
  placeholder: string;
  sendLabel: string;
  cancelLabel: string;
  onClose: () => void;
  onSend: (text: string) => void;
};

export function ExcellencePraiseModal({
  open,
  locale,
  title,
  placeholder,
  sendLabel,
  cancelLabel,
  onClose,
  onSend,
}: ExcellencePraiseModalProps) {
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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
  }

  return createPortal(
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-[#1F2428]/65 p-4 backdrop-blur-md">
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
        aria-labelledby="excellence-praise-title"
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[480px] rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(25,33,61,0.2)] sm:p-8"
      >
        <h2
          id="excellence-praise-title"
          className="mb-5 text-center text-lg font-bold text-[#170F49] sm:text-xl"
        >
          {title}
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="mb-6 w-full resize-y rounded-[12px] border border-[#333] px-4 py-3 text-sm leading-7 text-[#170F49] outline-none placeholder:text-[#A0A0B0] focus:border-[#D5AF34]"
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] bg-[#F0F0F0] px-4 py-3 text-sm font-bold text-[#170F49] transition hover:bg-[#E8E8E8]"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className="rounded-[12px] bg-[#D5AF34] px-4 py-3 text-sm font-bold text-[#170F49] transition hover:brightness-95"
          >
            {sendLabel}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
