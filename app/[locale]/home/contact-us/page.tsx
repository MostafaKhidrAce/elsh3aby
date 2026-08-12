import { SecondaryHero } from "@/components/about/SecondaryHero";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactInfoSection } from "@/components/contact/ContactInfoSection";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function ContactUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);
  const t = dictionary.contact;

  return (
    <div className="overflow-x-hidden bg-white p-2 sm:p-3 md:p-4 lg:p-6">
      <SecondaryHero
        locale={locale}
        dictionary={dictionary}
        title={t.heroTitle}
        breadcrumbHome={t.breadcrumbHome}
        breadcrumbCurrent={t.breadcrumbCurrent}
      />

      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <ContactInfoSection locale={locale} dictionary={dictionary} />
      </div>

      <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6">
        <ContactFormSection locale={locale} dictionary={dictionary} />
      </div>
    </div>
  );
}
