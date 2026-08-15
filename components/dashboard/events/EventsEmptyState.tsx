"use client";

import Image from "next/image";

type EventsEmptyStateProps = {
  title: string;
  description: string;
};

export function EventsEmptyState({ title, description }: EventsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center sm:py-24">
      <Image
        src="/backgrounds/Calendar-State.svg"
        alt=""
        width={220}
        height={180}
        className="h-auto w-[min(70vw,220px)]"
        priority
      />
      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-[#170F49] sm:text-xl">{title}</h3>
        <p className="text-sm text-[#6B7280] sm:text-base">{description}</p>
      </div>
    </div>
  );
}
