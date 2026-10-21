import { MarketBuyForm } from "@/components/dashboard/market/MarketBuyForm";
import { MarketProductLoader } from "@/components/dashboard/market/MarketProductLoader";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardMarketBuyPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <MarketProductLoader locale={localeParam} dictionary={dictionary} productId={id}>
      {(product) => (
        <MarketBuyForm
          locale={localeParam}
          dictionary={dictionary}
          product={product}
        />
      )}
    </MarketProductLoader>
  );
}
