"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Building2,
  CalendarDays,
  CircleArrowLeft,
  LogOut,
  Newspaper,
  Star,
  Store,
  UserRound,
  Users,
  Vote,
  Files,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type DashboardSidebarProps = {
  locale: Locale;
  dictionary: Dictionary;
  onNavigate?: () => void;
};

const GOLD = "#D5AF34";
const TEXT = "#133D3C";
const LOGOUT_RED = "#E11D48";

type NavLabelKey = {
  [K in keyof Dictionary["dashboard"]]: Dictionary["dashboard"][K] extends string
    ? K
    : never;
}[keyof Dictionary["dashboard"]];

type NavItem = {
  key: NavLabelKey;
  href: string;
  icon: LucideIcon;
  match: string | string[];
};

export function DashboardSidebar({
  locale,
  dictionary,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const t = dictionary.dashboard;
  const isAr = locale === "ar";

  const items: NavItem[] = [
    {
      key: "events",
      href: `/${locale}/dashboard/events`,
      icon: CalendarDays,
      match: ["/dashboard/events", "/dashboard/add-event"],
    },
    {
      key: "news",
      href: `/${locale}/dashboard/news`,
      icon: Newspaper,
      match: "/dashboard/news",
    },
    {
      key: "requests",
      href: `/${locale}/dashboard/requests`,
      icon: Files,
      match: "/dashboard/requests",
    },
    {
      key: "excellence",
      href: `/${locale}/dashboard/excellence`,
      icon: Star,
      match: "/dashboard/excellence",
    },
    {
      key: "members",
      href: `/${locale}/dashboard/members`,
      icon: Users,
      match: "/dashboard/members",
    },
    {
      key: "elections",
      href: `/${locale}/dashboard/elections`,
      icon: Vote,
      match: "/dashboard/elections",
    },
    {
      key: "booking",
      href: `/${locale}/dashboard/booking`,
      icon: Building2,
      match: "/dashboard/booking",
    },
    {
      key: "market",
      href: `/${locale}/dashboard/market`,
      icon: Store,
      match: "/dashboard/market",
    },
    {
      key: "achievements",
      href: `/${locale}/dashboard/achievements`,
      icon: BookOpen,
      match: "/dashboard/achievements",
    },
    {
      key: "profile",
      href: `/${locale}/dashboard/profile`,
      icon: UserRound,
      match: "/dashboard/profile",
    },
  ];

  function isActive(match: string | string[]) {
    const patterns = Array.isArray(match) ? match : [match];
    return patterns.some((pattern) => pathname.includes(pattern));
  }

  function handleLogout() {
    logout();
    onNavigate?.();
    router.push(`/${locale}/home`);
  }

  return (
    <aside
      dir={isAr ? "rtl" : "ltr"}
      className="flex h-full w-full flex-col rounded-[20px] bg-white px-2 py-3 shadow-[0_8px_30px_rgba(25,33,61,0.08)] sm:px-3 sm:py-4"
    >
      <Link
        href={`/${locale}/home`}
        onClick={onNavigate}
        className="mb-3 block w-full px-1.5 sm:mb-4 sm:px-2"
      >
        <Image
          src="/logos/full-logo-dashboard.svg"
          alt={dictionary.brand.name}
          width={300}
          height={90}
          className="h-auto w-full object-contain"
          priority
        />
      </Link>

      <Link
        href={`/${locale}/home`}
        onClick={onNavigate}
        className="mb-2 flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14px] font-medium text-[#6B7280] transition hover:bg-[#F7F7F7] sm:text-[15px]"
      >
        <CircleArrowLeft
          className={`h-5 w-5 shrink-0 ${isAr ? "" : "-scale-x-100"}`}
          strokeWidth={1.75}
        />
        <span>{t.backHome}</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pb-3">
        {items.map((item) => {
          const active = isActive(item.match);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14px] font-semibold transition sm:text-[15px] ${
                active ? "" : "text-[#426463] hover:bg-[#F7F7F7]"
              }`}
              style={active ? { backgroundColor: GOLD, color: TEXT } : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              <span>{t[item.key]}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14px] font-semibold transition hover:bg-red-50 sm:text-[15px]"
        style={{ color: LOGOUT_RED }}
      >
        <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.75} />
        <span>{t.logout}</span>
      </button>
    </aside>
  );
}
