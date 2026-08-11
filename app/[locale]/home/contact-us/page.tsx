import { ContactForm } from "@/components/contact/ContactForm";
import { HeroNav } from "@/components/layout/HeroNav";
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
    <>
      <HeroNav locale={locale} dictionary={dictionary} variant="solid" />
      <section className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="mt-3 text-lg text-muted">{t.subtitle}</p>
        </div>
        <ContactForm dictionary={t} />
      </section>
    </>
  );
}
