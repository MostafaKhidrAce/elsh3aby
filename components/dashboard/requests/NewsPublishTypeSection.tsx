"use client";

import { Gem, Users } from "lucide-react";
import { NewsPublishCard } from "@/components/dashboard/requests/NewsPublishCard";
import type {
  DummyNewsPublishRequest,
  NewsPublishStatus,
  NewsPublishTypeId,
} from "@/lib/dashboard/dummy-news-publish";
import type { Locale } from "@/lib/i18n/config";

type NewsPublishTypeSectionProps = {
  typeId: NewsPublishTypeId;
  title: string;
  items: DummyNewsPublishRequest[];
  locale: Locale;
  expanded: boolean;
  onToggleExpand: (typeId: NewsPublishTypeId) => void;
  showMoreLabel: string;
  showLessLabel: string;
  statusLabels: Record<NewsPublishStatus, string>;
};

const VISIBLE_COUNT = 3;

function TypeIcon({ typeId }: { typeId: NewsPublishTypeId }) {
  if (typeId === "wedding") {
    return <Gem className="h-4 w-4 text-white" strokeWidth={2} />;
  }
  return <Users className="h-4 w-4 text-white" strokeWidth={2} />;
}

export function NewsPublishTypeSection({
  typeId,
  title,
  items,
  locale,
  expanded,
  onToggleExpand,
  showMoreLabel,
  showLessLabel,
  statusLabels,
}: NewsPublishTypeSectionProps) {
  if (items.length === 0) return null;

  const visible = expanded ? items : items.slice(0, VISIBLE_COUNT);
  const canExpand = items.length > VISIBLE_COUNT;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#D5AF34]">
          <TypeIcon typeId={typeId} />
        </span>
        <h3 className="text-lg font-bold text-[#170F49]">{title}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <NewsPublishCard
            key={item.id}
            item={item}
            locale={locale}
            statusLabels={statusLabels}
          />
        ))}
      </div>

      {canExpand ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => onToggleExpand(typeId)}
            className="rounded-full bg-[#F3EBD2] px-8 py-2.5 text-sm font-semibold text-[#5C5C6B] transition hover:brightness-95"
          >
            {expanded ? showLessLabel : showMoreLabel}
          </button>
        </div>
      ) : null}
    </section>
  );
}
