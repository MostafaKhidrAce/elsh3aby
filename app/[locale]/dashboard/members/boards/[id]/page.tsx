import { PreviousBoardLoader } from "@/components/dashboard/members/PreviousBoardLoader";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardPreviousBoardPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <PreviousBoardLoader
      locale={localeParam}
      dictionary={dictionary}
      boardId={id}
    />
  );
}
