import { OfferDetailsLoader } from "@/components/dashboard/offers/OfferDetailsLoader";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardOfferDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <OfferDetailsLoader
      locale={localeParam}
      dictionary={dictionary}
      offerId={id}
    />
  );
}
