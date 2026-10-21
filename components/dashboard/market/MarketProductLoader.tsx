"use client";

import { useEffect, useState, type ReactNode } from "react";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { getProduct } from "@/lib/api/shop";
import { useAuth } from "@/lib/auth/auth-context";
import type { MarketProduct } from "@/lib/dashboard/dummy-market";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export function MarketProductLoader({
  locale,
  dictionary,
  productId,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  productId: string;
  children: (product: MarketProduct) => ReactNode;
}) {
  const { token, isReady } = useAuth();
  const [product, setProduct] = useState<MarketProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !token) return;
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

  return <>{children(product)}</>;
}
