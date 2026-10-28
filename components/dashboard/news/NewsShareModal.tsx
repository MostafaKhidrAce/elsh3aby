"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type NewsShareModalProps = {
  open: boolean;
  locale: Locale;
  title: string;
  url: string;
  text: string;
  whatsappLabel: string;
  facebookLabel: string;
  xLabel: string;
  telegramLabel: string;
  copyLabel: string;
  copiedLabel: string;
  onClose: () => void;
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.88c0 2.1.55 4.14 1.6 5.95L0 24l6.33-1.66a11.9 11.9 0 0 0 5.72 1.46h.01c6.55 0 11.88-5.34 11.88-11.9 0-3.18-1.24-6.16-3.42-8.42Zm-8.46 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.75.98 1-3.66-.24-.38a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.13 1.03 7 2.9a9.84 9.84 0 0 1 2.9 7c0 5.45-4.44 9.89-9.89 9.89Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-6.77 7.74L23.26 22h-6.53l-5.11-6.68L5.2 22H2.08l7.24-8.28L.74 2h6.7l4.62 6.12L18.9 2Zm-1.15 18.04h1.81L6.35 3.86H4.4l13.35 16.18Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M21.5 3.5 2.8 10.7c-1.28.5-1.27 1.2-.22 1.52l4.8 1.5 1.86 5.7c.23.7.11.97.76.97.5 0 .72-.23 1-.5l2.28-2.22 4.74 3.5c.87.48 1.5.23 1.72-.81L22.9 4.7c.3-1.2-.46-1.74-1.4-1.2Zm-3.1 3.4-8.9 8.13-.35 3.3-1.8-5.9 11.05-5.53Z" />
    </svg>
  );
}

export function NewsShareModal({
  open,
  locale,
  title,
  url,
  text,
  whatsappLabel,
  facebookLabel,
  xLabel,
  telegramLabel,
  copyLabel,
  copiedLabel,
  onClose,
}: NewsShareModalProps) {
  const isAr = locale === "ar";
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setCopied(false);
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

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const options = [
    {
      id: "whatsapp",
      label: whatsappLabel,
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      className: "bg-[#25D366] text-white",
      icon: <WhatsAppIcon />,
    },
    {
      id: "facebook",
      label: facebookLabel,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "bg-[#1877F2] text-white",
      icon: <FacebookIcon />,
    },
    {
      id: "x",
      label: xLabel,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      className: "bg-[#111111] text-white",
      icon: <XIcon />,
    },
    {
      id: "telegram",
      label: telegramLabel,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      className: "bg-[#229ED9] text-white",
      icon: <TelegramIcon />,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

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
        aria-labelledby="news-share-title"
        className="relative z-10 w-full max-w-[420px] rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(25,33,61,0.2)] sm:p-8"
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
          id="news-share-title"
          className="mb-6 text-center text-lg font-bold text-[#170F49] sm:text-xl"
        >
          {title}
        </h2>

        <div className="grid grid-cols-4 gap-3">
          {options.map((option) => (
            <a
              key={option.id}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-center"
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full transition hover:brightness-110 ${option.className}`}
              >
                {option.icon}
              </span>
              <span className="text-[11px] font-semibold text-[#170F49]">
                {option.label}
              </span>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => void copyLink()}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#E8E8E8] bg-[#F7F7F7] px-4 py-3 text-sm font-semibold text-[#133D3C] transition hover:bg-[#F0F0F0]"
        >
          {copied ? (
            <Check className="h-4 w-4 text-[#22C55E]" strokeWidth={2.25} />
          ) : (
            <Copy className="h-4 w-4" strokeWidth={2} />
          )}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </div>,
    document.body,
  );
}
