"use client";

type DashboardFetchStateProps = {
  loading: boolean;
  error: string | null;
  loadingLabel: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function DashboardFetchState({
  loading,
  error,
  loadingLabel,
  retryLabel,
  onRetry,
}: DashboardFetchStateProps) {
  if (!loading && !error) return null;
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      {loading ? (
        <p className="text-sm font-medium text-[#6B7280]">{loadingLabel}</p>
      ) : (
        <>
          <p className="text-sm font-medium text-[#E11D48]">{error}</p>
          {onRetry && retryLabel ? (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-full bg-[#F3EBD2] px-6 py-2 text-sm font-semibold text-[#133D3C]"
            >
              {retryLabel}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
