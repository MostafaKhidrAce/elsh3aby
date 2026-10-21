import { RequestDetailsLoader } from "@/components/dashboard/requests/RequestDetailsLoader";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardRequestDetailsRoute({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ cat?: string }>;
}) {
  const { locale: localeParam, id } = await params;
  const { cat } = await searchParams;
  if (!isLocale(localeParam)) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <RequestDetailsLoader
      locale={localeParam}
      dictionary={dictionary}
      requestId={id}
      category={cat === "consult" ? "consult" : "help"}
    />
  );
}
