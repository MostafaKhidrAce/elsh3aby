import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { EventsSection } from "@/components/home/EventsSection";
import { HomeHero } from "@/components/home/HomeHero";
import { NewsSection } from "@/components/home/NewsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);

  return (
    <div className="bg-white p-2 sm:p-3 md:p-4 lg:p-6">
      <HomeHero locale={locale} dictionary={dictionary} />
      <div id="after-hero" className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <AboutSection locale={locale} dictionary={dictionary} />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <ServicesSection locale={locale} dictionary={dictionary} />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <EventsSection locale={locale} dictionary={dictionary} />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <NewsSection locale={locale} dictionary={dictionary} />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <ContactSection locale={locale} dictionary={dictionary} />
      </div>
    </div>
  );
}
