"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type AnimatedStatProps = {
  value: number;
  label: string;
  moreThan: string;
  durationMs?: number;
};

export function AnimatedStat({
  value,
  label,
  moreThan,
  durationMs = 1600,
}: AnimatedStatProps) {
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
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <div
      ref={ref}
      className="flex min-h-[160px] flex-col items-center justify-center rounded-[16px] border border-white/20 px-3 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-[20px] sm:min-h-[200px] sm:rounded-[20px] sm:px-5 sm:py-6 lg:min-h-[260px] lg:px-[28px] lg:py-[35px]"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
    >
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        <Image
          src="/logos/mini-logo.svg"
          alt=""
          width={65}
          height={59}
          className="h-10 w-11 object-contain sm:h-12 sm:w-[54px] lg:h-[59px] lg:w-[65px]"
        />
        <p className="text-xs font-medium text-white/90 sm:text-sm lg:text-base">
          {label}
        </p>
        {moreThan ? (
          <p className="text-[28px] font-bold leading-none text-white sm:text-[32px] lg:text-[40px]">
            {moreThan}
          </p>
        ) : null}
        <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {count.toLocaleString("en-US")}
        </p>
      </div>
    </div>
  );
}
