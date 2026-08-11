import { AboutSection } from "@/components/home/AboutSection";
import { HomeHero } from "@/components/home/HomeHero";
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
    <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6">
      <HomeHero locale={locale} dictionary={dictionary} />
      <div id="after-hero" className="mt-3 sm:mt-4 md:mt-5 lg:mt-6">
        <AboutSection locale={locale} dictionary={dictionary} />
      </div>
    </div>
  );
}
