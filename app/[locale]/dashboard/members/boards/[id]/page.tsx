import { PreviousBoardPage } from "@/components/dashboard/members/PreviousBoardPage";
import { getPreviousBoardById } from "@/lib/dashboard/dummy-members";
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

  const board = getPreviousBoardById(id);
  if (!board) notFound();

  const dictionary = await getDictionary(localeParam);

  return (
    <PreviousBoardPage
      locale={localeParam}
      dictionary={dictionary}
      board={board}
    />
  );
}
