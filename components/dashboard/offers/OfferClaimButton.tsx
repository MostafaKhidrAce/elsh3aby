"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { redeemDiscountOffer } from "@/lib/api/requests";
import { useAuth } from "@/lib/auth/auth-context";
import type { Locale } from "@/lib/i18n/config";

type OfferClaimButtonProps = {
  offerId: string;
  couponCode: string;
  getOfferLabel: string;
  couponLabel: string;
  copiedLabel: string;
  locale: Locale;
  size?: "sm" | "lg";
};

export function OfferClaimButton({
  offerId,
  couponCode,
  getOfferLabel,
  couponLabel,
  copiedLabel,
  locale,
  size = "sm",
}: OfferClaimButtonProps) {
  const { token } = useAuth();
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!claimed) {
      if (!token) return;
      try {
        await redeemDiscountOffer(offerId, locale, token);
        setClaimed(true);
      } catch {
        setClaimed(true);
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore clipboard errors
    }
  }

  const sizeClass =
    size === "lg"
      ? "min-w-[240px] rounded-[14px] px-8 py-3.5 text-base"
      : "w-full rounded-[10px] px-4 py-2.5 text-sm";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 border font-bold transition ${sizeClass} ${
        claimed
          ? "border-[#F3EBD2] bg-[#FBF6E6] text-[#170F49]"
          : size === "lg"
            ? "border-transparent bg-[#D5AF34] text-white hover:brightness-95"
            : "border-[#D5AF34] bg-white text-[#D5AF34] hover:bg-[#FBF6E6]"
      }`}
    >
      {claimed ? (
        <>
          <span className="font-semibold text-[#6B6B7B]">{couponLabel}</span>
          <span className="font-bold text-[#D5AF34]">
            {copied ? copiedLabel : couponCode}
          </span>
          <Copy className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
        </>
      ) : (
        getOfferLabel
      )}
    </button>
  );
}
