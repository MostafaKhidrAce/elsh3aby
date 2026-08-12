import { AboutFaqSection } from "@/components/about/AboutFaqSection";
import { AboutGoalsSection } from "@/components/about/AboutGoalsSection";
import { AboutLineageSection } from "@/components/about/AboutLineageSection";
import { AboutStatsSection } from "@/components/about/AboutStatsSection";
import { SecondaryHero } from "@/components/about/SecondaryHero";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);

  return (
    <div className="overflow-x-hidden bg-white p-2 sm:p-3 md:p-4 lg:p-6">
      <SecondaryHero locale={locale} dictionary={dictionary} />
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <AboutLineageSection locale={locale} dictionary={dictionary} />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <AboutStatsSection locale={locale} dictionary={dictionary} />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <AboutGoalsSection locale={locale} dictionary={dictionary} />
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <AboutFaqSection locale={locale} dictionary={dictionary} />
      </div>
    </div>
  );
}
