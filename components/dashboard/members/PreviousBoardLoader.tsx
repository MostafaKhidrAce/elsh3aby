"use client";

import { useEffect, useState } from "react";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { PreviousBoardPage } from "@/components/dashboard/members/PreviousBoardPage";
import { getPreviousBoardById } from "@/lib/api/councils";
import { useAuth } from "@/lib/auth/auth-context";
import type { DummyPreviousBoard } from "@/lib/dashboard/dummy-members";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export function PreviousBoardLoader({
  locale,
  dictionary,
  boardId,
}: {
  locale: Locale;
  dictionary: Dictionary;
  boardId: string;
}) {
  const { token, isReady } = useAuth();
  const [board, setBoard] = useState<DummyPreviousBoard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !token) return;
    void getPreviousBoardById(boardId, locale, token)
      .then(setBoard)
      .finally(() => setLoading(false));
  }, [isReady, token, boardId, locale]);

  if (loading || !board) {
    return (
      <DashboardFetchState
        loading={loading}
        error={loading ? null : dictionary.common.loadError}
        loadingLabel={dictionary.common.loading}
      />
    );
  }

  return <PreviousBoardPage locale={locale} dictionary={dictionary} board={board} />;
}
