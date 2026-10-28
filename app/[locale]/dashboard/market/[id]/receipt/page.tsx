import { Suspense } from "react";
import { MarketProductLoader } from "@/components/dashboard/market/MarketProductLoader";
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
  const dictionary = await getDictionary(localeParam);

  return (
    <Suspense fallback={null}>
      <MarketProductLoader
        locale={localeParam}
        dictionary={dictionary}
        productId={id}
        view="receipt"
      />
    </Suspense>
  );
}
