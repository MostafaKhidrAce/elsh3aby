import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PublicCatalog } from "@/components/public/PublicCatalog";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function PublicEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);

  return (
    <Suspense fallback={null}>
      <PublicCatalog locale={locale} dictionary={dictionary} kind="events" />
    </Suspense>
  );
}
