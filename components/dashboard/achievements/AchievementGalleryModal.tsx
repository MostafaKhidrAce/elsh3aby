"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Download } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type AchievementGalleryModalProps = {
  open: boolean;
  locale: Locale;
  title: string;
  images: string[];
  startIndex?: number;
  onClose: () => void;
};

async function downloadImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("download failed");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export function AchievementGalleryModal({
  open,
  locale,
  title,
  images,
  startIndex = 0,
  onClose,
}: AchievementGalleryModalProps) {
  const isAr = locale === "ar";
  const slides = images.filter(Boolean);
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setIndex(Math.min(Math.max(startIndex, 0), Math.max(slides.length - 1, 0)));
  }, [open, startIndex, slides.length]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % slides.length);
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + slides.length) % slides.length);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, slides.length, isAr]);

  if (!mounted || !open || slides.length === 0) return null;

  const safeIndex = Math.min(index, slides.length - 1);
  const current = slides[safeIndex];

  function go(step: number) {
    setIndex((currentIndex) => (currentIndex + step + slides.length) % slides.length);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[220] flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-gallery-title"
      dir={isAr ? "rtl" : "ltr"}
    >
      <header className="flex h-14 shrink-0 items-center justify-between bg-white px-4 sm:h-16 sm:px-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="inline-flex h-10 w-10 items-center justify-center text-[#133D3C]"
        >
          <ArrowRight
            className={`h-6 w-6 ${isAr ? "" : "rotate-180"}`}
            strokeWidth={2}
          />
        </button>
        <h2
          id="achievement-gallery-title"
          className="text-base font-bold text-[#170F49] sm:text-lg"
        >
          {title}
        </h2>
        <button
          type="button"
          aria-label={title}
          onClick={() =>
            void downloadImage(
              current,
              `achievement-${safeIndex + 1}.jpg`,
            )
          }
          className="inline-flex h-10 w-10 items-center justify-center text-[#D5AF34]"
        >
          <Download className="h-6 w-6" strokeWidth={2} />
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        {slides.length > 1 ? (
          <button
            type="button"
            aria-label="Previous"
            onClick={() => go(-1)}
            className="absolute left-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : null}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current}
          alt=""
          className="max-h-full max-w-full object-contain"
        />

        {slides.length > 1 ? (
          <button
            type="button"
            aria-label="Next"
            onClick={() => go(1)}
            className="absolute right-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white sm:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="flex shrink-0 items-center justify-center gap-2 py-4">
          {slides.map((src, i) => (
            <button
              key={src + i}
              type="button"
              aria-label={`Image ${i + 1}`}
              aria-current={i === safeIndex}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition sm:h-2.5 sm:w-2.5 ${
                i === safeIndex ? "bg-[#D5AF34]" : "bg-white/45"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
