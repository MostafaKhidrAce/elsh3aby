"use client";

import { useEffect, useState } from "react";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { MarketBuyForm } from "@/components/dashboard/market/MarketBuyForm";
import { MarketProductDetailsPage } from "@/components/dashboard/market/MarketProductDetailsPage";
import { MarketReceiptPage } from "@/components/dashboard/market/MarketReceiptPage";
import { getProduct } from "@/lib/api/shop";
import { useAuth } from "@/lib/auth/auth-context";
import type { MarketProduct } from "@/lib/dashboard/dummy-market";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type MarketProductView = "details" | "buy" | "receipt";

type MarketProductLoaderProps = {
  locale: Locale;
  dictionary: Dictionary;
  productId: string;
  view: MarketProductView;
};

export function MarketProductLoader({
  locale,
  dictionary,
  productId,
  view,
}: MarketProductLoaderProps) {
  const { token, isReady } = useAuth();
  const [product, setProduct] = useState<MarketProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !token) return;
    setLoading(true);
    setError(null);
    void getProduct(productId, locale, token)
      .then(setProduct)
      .catch(() => setError(dictionary.common.loadError))
      .finally(() => setLoading(false));
  }, [isReady, token, productId, locale, dictionary.common.loadError]);

  if (loading || error || !product) {
    return (
      <DashboardFetchState
        loading={loading}
        error={error || (loading ? null : dictionary.common.loadError)}
        loadingLabel={dictionary.common.loading}
      />
    );
  }

  if (view === "buy") {
    return (
      <MarketBuyForm
        locale={locale}
        dictionary={dictionary}
        product={product}
      />
    );
  }

  if (view === "receipt") {
    return (
      <MarketReceiptPage
        locale={locale}
        dictionary={dictionary}
        product={product}
      />
    );
  }

  return (
    <MarketProductDetailsPage
      locale={locale}
      dictionary={dictionary}
      product={product}
    />
  );
}
