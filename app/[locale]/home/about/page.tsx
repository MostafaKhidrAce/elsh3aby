import { HeroNav } from "@/components/layout/HeroNav";
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
  const t = dictionary.about;

  return (
    <>
      <HeroNav locale={locale} dictionary={dictionary} variant="solid" />
      <section className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="mt-3 text-lg text-muted">{t.subtitle}</p>
        </div>
        <p className="leading-8 text-foreground">{t.body}</p>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-gold">{t.missionTitle}</h2>
          <p className="mt-3 leading-7 text-muted">{t.missionBody}</p>
        </div>
      </section>
    </>
  );
}
