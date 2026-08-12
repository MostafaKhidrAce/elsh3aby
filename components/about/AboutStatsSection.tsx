"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type AboutStatsSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const STATS = [
  { key: "total" as const, value: 3000 },
  { key: "males" as const, value: 780 },
  { key: "females" as const, value: 500 },
  { key: "endowments" as const, value: 100 },
];

const MUTED_GOLD = "#D4C4A8";

function AnimatedPlusStat({
  value,
  label,
  durationMs = 1600,
}: {
  value: number;
  label: string;
  durationMs?: number;
}) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <div ref={ref} className="flex min-w-0 flex-col items-center text-center">
      <p
        className="text-[28px] font-bold leading-none text-white sm:text-[36px] lg:text-[48px]"
        dir="ltr"
      >
        {count.toLocaleString("en-US")}+
      </p>
      <p
        className="mt-2 max-w-[160px] text-[12px] font-medium leading-5 sm:mt-3 sm:max-w-[180px] sm:text-[13px] sm:leading-6 lg:text-[15px] lg:leading-7"
        style={{ color: MUTED_GOLD }}
      >
        {label}
      </p>
    </div>
  );
}

export function AboutStatsSection({
  dictionary,
}: AboutStatsSectionProps) {
  const t = dictionary.about.statsSection;

  return (
    <section
      id="about-stats-section"
      className="max-w-full overflow-hidden rounded-[20px] px-3 py-8 sm:px-6 sm:py-12 lg:px-12 lg:py-24 xl:py-28"
      style={{ backgroundColor: "#133D3C" }}
    >
      <div className="mx-auto w-full max-w-7xl xl:max-w-[1400px]">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="text-[14px] font-medium sm:text-[16px] lg:text-[20px]"
            style={{ color: MUTED_GOLD }}
          >
            {t.eyebrow}
          </p>
          <h2 className="mt-2 text-[22px] font-bold leading-tight text-white sm:mt-3 sm:text-[28px] md:text-[34px] lg:text-[42px]">
            {t.title}
          </h2>
          <p
            className="mx-auto mt-3 max-w-3xl text-[13px] font-normal leading-6 sm:mt-4 sm:text-[15px] sm:leading-7 lg:text-[18px] lg:leading-9"
            style={{ color: MUTED_GOLD }}
          >
            {t.description}
          </p>
        </div>

        <div className="my-6 h-px w-full bg-white/20 sm:my-8 lg:my-12" />

        <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-4 lg:gap-6">
          {STATS.map((stat) => (
            <AnimatedPlusStat
              key={stat.key}
              value={stat.value}
              label={t.stats[stat.key]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
