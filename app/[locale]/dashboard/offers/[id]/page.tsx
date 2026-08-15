import { OfferDetailsPage } from "@/components/dashboard/offers/OfferDetailsPage";
import { getOfferById } from "@/lib/dashboard/dummy-offers";
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
  const offer = getOfferById(id);
  if (!offer) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <OfferDetailsPage
      locale={localeParam}
      dictionary={dictionary}
      offer={offer}
    />
  );
}
