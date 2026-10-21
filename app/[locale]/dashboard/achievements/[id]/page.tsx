import { AchievementDetailsLoader } from "@/components/dashboard/achievements/AchievementDetailsLoader";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardAchievementDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <AchievementDetailsLoader
      locale={localeParam}
      dictionary={dictionary}
      bookId={id}
    />
  );
}
