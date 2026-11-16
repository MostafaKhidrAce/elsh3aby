import { notFound } from "next/navigation";
import { PublicDetail } from "@/components/public/PublicDetail";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function PublicNewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);

  return <PublicDetail locale={locale} dictionary={dictionary} kind="news" id={id} />;
}
