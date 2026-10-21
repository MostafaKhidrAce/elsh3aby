"use client";

import { useEffect, useState } from "react";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { ConsultRequestDetailsPage } from "@/components/dashboard/requests/ConsultRequestDetailsPage";
import { HelpRequestDetailsPage } from "@/components/dashboard/requests/HelpRequestDetailsPage";
import { ApiError } from "@/lib/api/client";
import { getConsultation, getHelpOrder } from "@/lib/api/requests";
import { useAuth } from "@/lib/auth/auth-context";
import type { DummyRequest } from "@/lib/dashboard/dummy-requests";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export function RequestDetailsLoader({
  locale,
  dictionary,
  requestId,
  category,
}: {
  locale: Locale;
  dictionary: Dictionary;
  requestId: string;
  category: "help" | "consult";
}) {
  const { token, isReady } = useAuth();
  const [item, setItem] = useState<DummyRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !token) return;
    const load =
      category === "consult"
        ? getConsultation(requestId, locale, token)
        : getHelpOrder(requestId, locale, token);
    void load
      .then(setItem)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : dictionary.common.loadError),
      )
      .finally(() => setLoading(false));
  }, [isReady, token, requestId, category, locale, dictionary.common.loadError]);

  if (loading || error || !item) {
    return (
      <DashboardFetchState
        loading={loading}
        error={error || (loading ? null : dictionary.common.loadError)}
        loadingLabel={dictionary.common.loading}
        retryLabel={dictionary.common.retry}
      />
    );
  }

  if (item.category === "consult") {
    return (
      <ConsultRequestDetailsPage
        locale={locale}
        dictionary={dictionary}
        item={item}
      />
    );
  }

  return (
    <HelpRequestDetailsPage locale={locale} dictionary={dictionary} item={item} />
  );
}
