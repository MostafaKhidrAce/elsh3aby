"use client";

import { useEffect, useState } from "react";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { AchievementDetailsPage } from "@/components/dashboard/achievements/AchievementDetailsPage";
import { getBook } from "@/lib/api/books";
import { useAuth } from "@/lib/auth/auth-context";
import type { DummyAchievement } from "@/lib/dashboard/dummy-achievements";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export function AchievementDetailsLoader({
  locale,
  dictionary,
  bookId,
}: {
  locale: Locale;
  dictionary: Dictionary;
  bookId: string;
}) {
  const { token, isReady } = useAuth();
  const [item, setItem] = useState<DummyAchievement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !token) return;
    void getBook(bookId, locale, token)
      .then(setItem)
      .finally(() => setLoading(false));
  }, [isReady, token, bookId, locale]);

  if (loading || !item) {
    return (
      <DashboardFetchState
        loading={loading}
        error={loading ? null : dictionary.common.loadError}
        loadingLabel={dictionary.common.loading}
      />
    );
  }

  return (
    <AchievementDetailsPage locale={locale} dictionary={dictionary} item={item} />
  );
}
