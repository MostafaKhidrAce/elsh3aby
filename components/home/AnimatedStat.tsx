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
      className="flex min-h-[220px] flex-col items-center justify-center rounded-[20px] border border-white/20 px-[28px] py-[35px] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-[20px] sm:min-h-[260px]"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
    >
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/logos/mini-logo.svg"
          alt=""
          width={65}
          height={59}
          className="h-[59px] w-[65px] object-contain"
        />
        <p className="text-sm font-medium text-white/90 sm:text-base">{label}</p>
        <p className="text-[40px] font-bold leading-none text-white">{moreThan}</p>
        <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {count.toLocaleString("en-US")}
        </p>
      </div>
    </div>
  );
}
