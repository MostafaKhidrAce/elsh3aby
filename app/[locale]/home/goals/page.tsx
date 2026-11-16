import { notFound } from "next/navigation";
import { SecondaryHero } from "@/components/about/SecondaryHero";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function GoalsPage({
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
        title={t.goalsTitle}
        breadcrumbHome={dictionary.about.breadcrumbHome}
        breadcrumbCurrent={t.goalsTitle}
      />
      <article className="mx-auto mt-4 w-full max-w-4xl rounded-[20px] bg-white px-4 py-10 sm:px-8 sm:py-14">
        <ul className="flex flex-col gap-4">
          {t.goals.map((goal) => (
            <li
              key={goal}
              className="rounded-2xl border border-[#E5E5E5] bg-[#F6EFE7] px-5 py-4 text-base font-medium leading-7 text-[#133D3C] sm:text-lg"
            >
              {goal}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
