"use client";

import { useEffect, useState } from "react";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { EventsSection } from "@/components/home/EventsSection";
import { HomeHero } from "@/components/home/HomeHero";
import { NewsSection } from "@/components/home/NewsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { WebsitePageLoading } from "@/components/layout/WebsitePageLoading";
import { getWebsiteHome } from "@/lib/api/website";
import type { WebsiteHomeData } from "@/lib/api/website";
import {
  toAboutTeaserView,
  toEventsView,
  toHomeHeroView,
  toJoinView,
  toNewsView,
  toServicesView,
} from "@/lib/api/website-view";

type HomePageClientProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function HomePageClient({ locale, dictionary }: HomePageClientProps) {
  const [home, setHome] = useState<WebsiteHomeData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getWebsiteHome(locale)
      .then((nextHome) => {
        if (!cancelled) setHome(nextHome);
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

  const hero = toHomeHeroView(locale, dictionary, home);
  const about = toAboutTeaserView(locale, dictionary, home);
  const services = toServicesView(locale, dictionary, home);
  const events = toEventsView(locale, dictionary, home);
  const news = toNewsView(locale, dictionary, home);
  const join = toJoinView(locale, dictionary, home);

  return (
    <div className="bg-white p-2 sm:p-3 md:p-4 lg:p-6">
      <HomeHero locale={locale} dictionary={dictionary} data={hero} />
      <div id="after-hero" className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <AboutSection locale={locale} dictionary={dictionary} data={about} />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <ServicesSection
          eyebrow={services.eyebrow}
          title={services.title}
          description={services.description}
          cards={services.cards}
        />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <EventsSection
          locale={locale}
          dictionary={dictionary}
          title={events.title}
          description={events.description}
          cta={events.cta}
          events={events.events}
        />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <NewsSection
          locale={locale}
          dictionary={dictionary}
          eyebrow={news.eyebrow}
          title={news.title}
          description={news.description}
          cards={news.cards}
        />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <ContactSection
          locale={locale}
          dictionary={dictionary}
          data={join}
        />
      </div>
    </div>
  );
}
