"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type DashboardItemsEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  imageSrc?: string;
};

export function DashboardItemsEmptyState({
  title,
  description,
  action,
  imageSrc = "/backgrounds/items-not.svg",
}: DashboardItemsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center sm:py-16">
      <Image
        src={imageSrc}
        alt=""
        width={220}
        height={180}
        className="h-auto w-[min(70vw,240px)]"
        priority
      />
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-bold text-[#170F49] sm:text-xl">{title}</h3>
        <p className="text-sm leading-7 text-[#6B7280] sm:text-base">
          {description}
        </p>
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
