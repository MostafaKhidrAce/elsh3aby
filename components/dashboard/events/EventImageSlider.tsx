"use client";

import { useState } from "react";
import { ImageLightbox } from "@/components/dashboard/events/ImageLightbox";
import type { Locale } from "@/lib/i18n/config";

type EventImageSliderProps = {
  images: string[];
  locale: Locale;
  alt?: string;
};

export function EventImageSlider({
  images,
  alt = "",
}: EventImageSliderProps) {
  const [index, setIndex] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (images.length === 0) return null;

  const safeIndex = Math.min(index, images.length - 1);
  const current = images[safeIndex];

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-[16px] bg-[#F5F5F5]">
        <button
          type="button"
          className="relative block w-full cursor-zoom-in"
          onClick={() => setLightboxSrc(current)}
          aria-label="Open image"
        >
          <div className="relative aspect-[16/9] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
          </div>
        </button>
      </div>

      {images.length > 1 ? (
        <div className="flex items-center justify-center gap-2">
          {images.map((src, i) => (
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
