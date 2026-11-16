import { notFound } from "next/navigation";
import { SecondaryHero } from "@/components/about/SecondaryHero";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function MissionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);
  const t = dictionary.publicPages;

  return (
    <div className="overflow-x-hidden bg-white p-2 sm:p-3 md:p-4 lg:p-6">
      <SecondaryHero
        locale={locale}
        dictionary={dictionary}
        title={t.missionTitle}
        breadcrumbHome={dictionary.about.breadcrumbHome}
        breadcrumbCurrent={t.missionTitle}
      />
      <article className="mx-auto mt-4 w-full max-w-4xl rounded-[20px] bg-white px-4 py-10 sm:px-8 sm:py-14">
        <p className="text-lg leading-9 text-[#133D3C] sm:text-xl sm:leading-10">{t.missionBody}</p>
      </article>
    </div>
  );
}
