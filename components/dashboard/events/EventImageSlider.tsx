"use client";

import { useEffect, useState } from "react";
import { ImageLightbox } from "@/components/dashboard/events/ImageLightbox";
import type { Locale } from "@/lib/i18n/config";

type EventImageSliderProps = {
  images: string[];
  locale?: Locale;
  alt?: string;
  intervalMs?: number;
};

export function EventImageSlider({
  images,
  alt = "",
  intervalMs = 4000,
}: EventImageSliderProps) {
  const [index, setIndex] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const slides = images.filter(Boolean);

  useEffect(() => {
    setIndex(0);
  }, [slides.join("|")]);

  useEffect(() => {
    if (slides.length < 2 || paused || lightboxSrc) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, paused, lightboxSrc, intervalMs]);

  if (slides.length === 0) return null;

  const safeIndex = Math.min(index, slides.length - 1);
  const current = slides[safeIndex];

  return (
    <div className="space-y-3">
      <div
        className="relative overflow-hidden rounded-[16px] bg-[#F5F5F5]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          type="button"
          className="relative block w-full cursor-zoom-in"
          onClick={() => setLightboxSrc(current)}
          aria-label="Open image"
        >
          <div className="relative aspect-[16/9] w-full">
            {slides.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src + i}
                src={src}
                alt={alt}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  i === safeIndex ? "opacity-100" : "opacity-0"
                }`}
                draggable={false}
              />
            ))}
          </div>
        </button>
      </div>

      {slides.length > 1 ? (
        <div className="flex items-center justify-center gap-2">
          {slides.map((src, i) => (
            <button
              key={src + i}
              type="button"
              aria-label={`Image ${i + 1}`}
              aria-current={i === safeIndex}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === safeIndex ? "bg-[#D5AF34]" : "bg-[#E8D9A8]"
              }`}
            />
          ))}
        </div>
      ) : null}

      <ImageLightbox
        src={lightboxSrc}
        alt={alt}
        onClose={() => setLightboxSrc(null)}
      />
    </div>
  );
}
