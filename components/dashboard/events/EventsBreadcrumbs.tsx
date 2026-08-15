"use client";

import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

type EventsBreadcrumbsProps = {
  items: Crumb[];
};

export function EventsBreadcrumbs({ items }: EventsBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <span className="text-[#C4C4C4]" aria-hidden>
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`font-semibold transition hover:text-[#D5AF34] ${
                    index === 0 ? "text-[#133D3C]" : "text-[#8B8B9A]"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "font-semibold text-[#8B8B9A]"
                      : "font-bold text-[#133D3C]"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
