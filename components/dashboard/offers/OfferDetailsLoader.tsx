"use client";

import { useEffect, useState } from "react";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { OfferDetailsPage } from "@/components/dashboard/offers/OfferDetailsPage";
import { ApiError } from "@/lib/api/client";
import { getDiscountOffer } from "@/lib/api/requests";
import { useAuth } from "@/lib/auth/auth-context";
import type { DummyOffer } from "@/lib/dashboard/dummy-offers";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export function OfferDetailsLoader({
  locale,
  dictionary,
  offerId,
}: {
  locale: Locale;
  dictionary: Dictionary;
  offerId: string;
}) {
  const { token, isReady } = useAuth();
  const [offer, setOffer] = useState<DummyOffer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !token) return;
    void getDiscountOffer(offerId, locale, token)
      .then(setOffer)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : dictionary.common.loadError),
      )
      .finally(() => setLoading(false));
  }, [isReady, token, offerId, locale, dictionary.common.loadError]);

  if (loading || error || !offer) {
    return (
      <DashboardFetchState
        loading={loading}
        error={error || (loading ? null : dictionary.common.loadError)}
        loadingLabel={dictionary.common.loading}
      />
    );
  }

  return <OfferDetailsPage locale={locale} dictionary={dictionary} offer={offer} />;
}
