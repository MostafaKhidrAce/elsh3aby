"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AboutFaqSection } from "@/components/about/AboutFaqSection";
import { AboutGoalsSection } from "@/components/about/AboutGoalsSection";
import { AboutLineageSection } from "@/components/about/AboutLineageSection";
import { AboutStatsSection } from "@/components/about/AboutStatsSection";
import { SecondaryHero } from "@/components/about/SecondaryHero";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { WebsitePageLoading } from "@/components/layout/WebsitePageLoading";
import { getWebsiteAbout } from "@/lib/api/website";
import type { WebsiteAboutData } from "@/lib/api/website";
import {
  toAboutHeroView,
  toFaqView,
  toGoalsView,
  toLineageView,
  toQuickStatsView,
} from "@/lib/api/website-view";

type AboutPageClientProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function AboutPageClient({ locale, dictionary }: AboutPageClientProps) {
  const [about, setAbout] = useState<WebsiteAboutData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getWebsiteAbout(locale)
      .then((nextAbout) => {
        if (!cancelled) setAbout(nextAbout);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (!loaded) {
    return <WebsitePageLoading label={dictionary.common.loading} />;
  }

  const hero = toAboutHeroView(locale, dictionary, about);
  const lineage = toLineageView(locale, dictionary, about);
  const stats = toQuickStatsView(locale, dictionary, about);
  const goals = toGoalsView(locale, dictionary, about);
  const faq = toFaqView(locale, dictionary, about);

  return (
    <div className="overflow-x-hidden bg-white p-2 sm:p-3 md:p-4 lg:p-6">
      <SecondaryHero
        locale={locale}
        dictionary={dictionary}
        title={hero.title}
        breadcrumbHome={dictionary.about.breadcrumbHome}
        breadcrumbCurrent={dictionary.about.breadcrumbCurrent}
        backgroundUrl={hero.backgroundUrl}
      />
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <AboutLineageSection
          locale={locale}
          dictionary={dictionary}
          data={lineage}
        />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <AboutStatsSection
          locale={locale}
          dictionary={dictionary}
          eyebrow={stats.eyebrow}
          title={stats.title}
          description={stats.description}
          items={stats.items}
        />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <AboutGoalsSection
          locale={locale}
          dictionary={dictionary}
          data={goals}
        />
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-3 px-3">
        <Link
          href={`/${locale}/home/mission`}
          className="rounded-md bg-[#133D3C] px-5 py-3 text-sm font-semibold text-white"
        >
          {dictionary.publicPages.missionLink}
        </Link>
        <Link
          href={`/${locale}/home/goals`}
          className="rounded-md border border-[#133D3C] px-5 py-3 text-sm font-semibold text-[#133D3C]"
        >
          {dictionary.publicPages.goalsLink}
        </Link>
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <AboutFaqSection data={faq} />
      </div>
    </div>
  );
}
