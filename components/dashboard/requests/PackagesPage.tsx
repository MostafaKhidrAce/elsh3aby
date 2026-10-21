"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { DashboardFetchState } from "@/components/dashboard/DashboardFetchState";
import { ApiError } from "@/lib/api/client";
import {
  getSubscriptions,
  subscribeToPackage,
  type SubscriptionPackage,
} from "@/lib/api/subscriptions";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type PackagesPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function PackagesPage({ locale, dictionary }: PackagesPageProps) {
  const t = dictionary.dashboard.requestsPage;
  const isAr = locale === "ar";
  const router = useRouter();
  const { token, isReady } = useAuth();
  const requestsHref = `/${locale}/dashboard/requests`;
  const dashboardHref = `/${locale}/dashboard`;
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !token) return;
    void getSubscriptions(locale, token)
      .then(setPackages)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : dictionary.common.loadError),
      )
      .finally(() => setLoading(false));
  }, [isReady, token, locale, dictionary.common.loadError]);

  async function handleSubscribe(packageId: number) {
    if (!token) return;
    try {
      await subscribeToPackage(packageId, locale, token);
      router.push(requestsHref);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <header
        className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="space-y-3">
          <EventsBreadcrumbs
            items={[
              { label: t.title, href: requestsHref },
              { label: t.packagesBreadcrumb },
            ]}
          />
          <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
            {t.title}
          </h1>
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={`${cardClass} space-y-8`}>
        <Link
          href={dashboardHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#133D3C] transition hover:text-[#D5AF34]"
        >
          <ArrowRight
            className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`}
            strokeWidth={2.25}
          />
          {t.packagesBackHome}
        </Link>

        <p className="mx-auto max-w-2xl text-center text-sm leading-7 text-[#5C5C6B] sm:text-[15px] sm:leading-8">
          {t.packagesIntro}
        </p>

        <DashboardFetchState
          loading={loading}
          error={error}
          loadingLabel={dictionary.common.loading}
        />

        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-5">
          {packages.map((pkg) => {
            const duration = isAr
              ? `${pkg.durationMonths} شهر`
              : `${pkg.durationMonths} months`;
            return (
              <article
                key={pkg.id}
                className="flex flex-col gap-5 rounded-[16px] border border-[#E8E8E8] bg-white p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-bold text-[#170F49]">
                    {duration}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logos/crown.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                    draggable={false}
                  />
                </div>

                <p className="text-2xl font-bold text-[#133D3C] sm:text-[28px]">
                  {pkg.price}{" "}
                  <span className="text-lg font-bold sm:text-xl">
                    {t.currency}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={() => handleSubscribe(pkg.id)}
                  className="mt-auto inline-flex w-full items-center justify-center rounded-[10px] border border-[#D5AF34] bg-white px-4 py-2.5 text-sm font-bold text-[#D5AF34] transition hover:bg-[#FBF6E6]"
                >
                  {t.subscribeNow}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
