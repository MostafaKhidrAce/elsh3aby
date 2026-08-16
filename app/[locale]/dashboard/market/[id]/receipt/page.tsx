import { Suspense } from "react";
import { MarketReceiptPage } from "@/components/dashboard/market/MarketReceiptPage";
import { getMarketProductById } from "@/lib/dashboard/dummy-market";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardMarketReceiptPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const product = getMarketProductById(id);
  if (!product) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <Suspense fallback={null}>
      <MarketReceiptPage
        locale={localeParam}
        dictionary={dictionary}
        product={product}
      />
    </Suspense>
  );
}
