"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { DummyExcellence } from "@/lib/dashboard/dummy-excellence";
import type { Locale } from "@/lib/i18n/config";

type ExcellenceDetailsModalProps = {
  open: boolean;
  locale: Locale;
  item: DummyExcellence | null;
  categoryLabel: string;
  praisesTitle: string;
  sendPraiseLabel: string;
  onClose: () => void;
  onSendPraise: () => void;
};

export function ExcellenceDetailsModal({
  open,
  locale,
  item,
  categoryLabel,
  praisesTitle,
  sendPraiseLabel,
  onClose,
  onSendPraise,
}: ExcellenceDetailsModalProps) {
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

  if (!mounted || !open || !item) return null;

  const name = isAr ? item.name : item.nameEn;
  const title = isAr ? item.title : item.titleEn;
  const bio = isAr ? item.bio : item.bioEn;
  const hasPraises = item.praises.length > 0;

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
        aria-labelledby="excellence-details-title"
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
              src={item.image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 sm:px-7">
          <div className="flex flex-col items-center text-center">
            <h2
              id="excellence-details-title"
              className="text-xl font-bold text-[#170F49] sm:text-2xl"
            >
              {name}
            </h2>
            <p className="mt-2 text-sm text-[#6B6B7B]">
              {title} – {item.year}
            </p>
            <span className="mt-3 inline-flex rounded-full bg-[#F6F1E8] px-3 py-1 text-xs font-semibold text-[#D5AF34]">
              {categoryLabel}
            </span>
            <p className="mt-4 max-w-[420px] text-sm leading-7 text-[#4A4A57] sm:leading-8">
              {bio}
            </p>
          </div>

          {hasPraises ? (
            <div className="mt-6 border-t border-[#EFEFEF] pt-5 text-start">
              <h3 className="mb-3 text-base font-bold text-[#170F49]">
                {praisesTitle}
              </h3>
              <div className="space-y-3">
                {item.praises.map((praise) => {
                  const author = isAr ? praise.author : praise.authorEn;
                  const text = isAr ? praise.text : praise.textEn;
                  return (
                    <div
                      key={praise.id}
                      className="rounded-[12px] bg-[#F7F7F8] px-4 py-3 text-start"
                    >
                      <p className="mb-1 text-sm font-bold text-[#170F49]">
                        {author}
                      </p>
                      <p className="text-sm leading-7 text-[#5C5C6B]">{text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-[#F0F0F0] bg-white px-5 py-4 sm:px-7 sm:py-5">
          <button
            type="button"
            onClick={onSendPraise}
            className="inline-flex w-full items-center justify-center rounded-[12px] border border-[#D5AF34] bg-white px-4 py-3 text-sm font-bold text-[#133D3C] transition hover:bg-[#FBF6E6]"
          >
            {sendPraiseLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
