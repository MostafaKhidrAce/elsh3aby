import { DashboardPagePlaceholder } from "@/components/dashboard/DashboardPagePlaceholder";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardNewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <DashboardPagePlaceholder
      title={dictionary.dashboard.news}
      dictionary={dictionary}
    />
  );
}
