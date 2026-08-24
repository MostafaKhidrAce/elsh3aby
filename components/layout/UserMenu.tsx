"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type UserMenuProps = {
  locale: Locale;
  dictionary: Dictionary;
  onNavigate?: () => void;
};

const PLACEHOLDER_AVATAR = "/placeholder/user-placeholder-img.svg";
const GOLD = "#D5AF34";
const TEXT = "#170F49";

function resolveDisplayName(rawName: string | undefined, fallback: string) {
  const trimmed = (rawName || "").trim();
  if (!trimmed) return fallback;
  // Don't show national ID / pure numeric codes as the display name
  if (/^\d+$/.test(trimmed)) return fallback;
  return trimmed;
}

export function UserMenu({ locale, dictionary, onNavigate }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const t = dictionary.nav;
  const isAr = locale === "ar";

  const displayName = resolveDisplayName(user?.name, t.defaultMemberName);
  const firstName = displayName.split(/\s+/)[0] || displayName;
  const welcomeLabel = t.welcomeBack.replace("{name}", firstName);
  const avatarSrc = user?.avatarUrl?.trim() || PLACEHOLDER_AVATAR;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await logout();
    onNavigate?.();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        dir="ltr"
        className="inline-flex max-w-[260px] items-center gap-2 rounded-full border bg-[#FBF8F0] px-2 py-1.5 text-start transition hover:brightness-95 sm:max-w-[300px] sm:gap-2.5 sm:px-2.5 sm:py-1.5"
        style={{ borderColor: GOLD, color: TEXT }}
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
        <span
          className="min-w-0 flex-1 truncate text-[12px] font-semibold sm:text-[13px]"
          dir={isAr ? "rtl" : "ltr"}
        >
          {welcomeLabel}
        </span>
        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#E8D9A8] bg-white sm:h-9 sm:w-9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        </span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          dir={isAr ? "rtl" : "ltr"}
          className={`absolute z-[60] mt-2 w-[220px] overflow-hidden rounded-[14px] border border-[#E8D9A8] bg-white py-1.5 shadow-[0_12px_32px_rgba(25,33,61,0.12)] ${
            isAr ? "start-0" : "end-0"
          }`}
        >
          <div className="border-b border-[#F0E6C8] px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#E8D9A8] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarSrc}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <div className="min-w-0">
                <p
                  className="truncate text-[13px] font-bold"
                  style={{ color: TEXT }}
                >
                  {displayName}
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/${locale}/dashboard/events`}
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium transition hover:bg-[#FBF7F2]"
            style={{ color: TEXT }}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span>{t.dashboard}</span>
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-start text-[13px] font-medium transition hover:bg-[#FBF7F2]"
            style={{ color: TEXT }}
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span>{t.logout}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
