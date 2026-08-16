"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Download, Store } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import type { MarketProduct } from "@/lib/dashboard/dummy-market";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type MarketReceiptPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  product: MarketProduct;
};

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-[#E8E8E8] bg-white px-4 py-3 text-center">
      <p className="text-xs font-semibold text-[#9CA3AF]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#170F49]">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F0F0F0] py-3 last:border-b-0">
      <span className="shrink-0 text-sm font-bold text-[#170F49]">{label}</span>
      <span className="text-end text-sm text-[#5C5C6B]">{value}</span>
    </div>
  );
}

export function MarketReceiptPage({
  locale,
  dictionary,
  product,
}: MarketReceiptPageProps) {
  const t = dictionary.dashboard.marketPage;
  const isAr = locale === "ar";
  const searchParams = useSearchParams();

  const qty = Math.max(1, Number(searchParams.get("qty") ?? "3") || 3);
  const name =
    searchParams.get("name") ||
    (isAr ? "عبدالله سلمان محمد" : "Abdullah Salman Mohammad");
  const mobile = searchParams.get("mobile") || "05XXXXXXXX";
  const address =
    searchParams.get("address") || (isAr ? "الرياض" : "Riyadh");
  const location =
    searchParams.get("location") ||
    (isAr
      ? "الرحمانية، الرياض 12343، السعودية"
      : "Al-Rahmaniyah, Riyadh 12343, Saudi Arabia");
  const notes =
    searchParams.get("notes") ||
    (isAr
      ? "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة."
      : "This is sample placeholder text for additional notes.");

  const productTitle = isAr ? product.title : product.titleEn;
  const total = product.price * qty;
  const marketHref = `/${locale}/dashboard/market`;
  const detailsHref = `/${locale}/dashboard/market/${product.id}`;

  return (
    <div className="space-y-4 sm:space-y-5">
      <header
        className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="space-y-3">
          <Link
            href={marketHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#133D3C] transition hover:text-[#D5AF34]"
          >
            <ArrowRight
              className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`}
              strokeWidth={2.25}
            />
            {t.back}
          </Link>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
              {t.title}
            </h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#133D3C]">
              <Store className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
              <EventsBreadcrumbs
                items={[
                  { label: t.title, href: marketHref },
                  { label: t.detailsBreadcrumb, href: detailsHref },
                  { label: t.receiptBreadcrumb },
                ]}
              />
            </div>
          </div>
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={`${cardClass} mx-auto max-w-2xl`}>
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/check%20done.svg"
            alt=""
            width={96}
            height={96}
            className="h-24 w-24 object-contain"
            draggable={false}
          />
          <h2 className="mt-4 text-xl font-bold text-[#170F49]">
            {t.paymentSuccess}
          </h2>
          <p className="mt-3 text-base font-semibold text-[#170F49]">
            {t.totalAmount}{" "}
            <span className="text-lg font-bold">
              {total} {t.riyal}
            </span>
          </p>
        </div>

        <div
          className="relative mt-6 overflow-hidden rounded-[18px] border border-[#EFEFEF] bg-[#FAFAFA] p-4 sm:p-5"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% calc(100% - 12px), 97% 100%, 94% calc(100% - 12px), 91% 100%, 88% calc(100% - 12px), 85% 100%, 82% calc(100% - 12px), 79% 100%, 76% calc(100% - 12px), 73% 100%, 70% calc(100% - 12px), 67% 100%, 64% calc(100% - 12px), 61% 100%, 58% calc(100% - 12px), 55% 100%, 52% calc(100% - 12px), 49% 100%, 46% calc(100% - 12px), 43% 100%, 40% calc(100% - 12px), 37% 100%, 34% calc(100% - 12px), 31% 100%, 28% calc(100% - 12px), 25% 100%, 22% calc(100% - 12px), 19% 100%, 16% calc(100% - 12px), 13% 100%, 10% calc(100% - 12px), 7% 100%, 4% calc(100% - 12px), 0 100%)",
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <InfoBox label={t.productName} value={productTitle} />
            <InfoBox label={t.operationNumber} value="#999" />
            <InfoBox
              label={t.productsCount}
              value={`${qty} ${t.productUnit}`}
            />
            <InfoBox label={t.paymentDate} value="25 / 11 / 2025" />
          </div>

          <div className="mt-4 rounded-[12px] bg-white px-4 py-1">
            <DetailRow label={t.name} value={name} />
            <DetailRow label={t.mobile} value={mobile} />
            <DetailRow label={t.address} value={address} />
            <DetailRow label={t.location} value={location} />
            <DetailRow label={t.bankAccount} value="SA70 10000017" />
            <DetailRow
              label={t.accountType}
              value={isAr ? "نوع الحساب" : "Account type"}
            />
          </div>

          <div className="mt-4 rounded-[12px] bg-white px-4 py-3 text-start">
            <p className="text-sm font-bold text-[#170F49]">{t.notes}</p>
            <p className="mt-2 text-sm leading-7 text-[#6B6B7B]">{notes}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => console.log("download pdf", product.id)}
            className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#D5AF34] bg-white px-8 py-3 text-sm font-bold text-[#D5AF34] transition hover:bg-[#FBF6E6]"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            {t.downloadPdf}
          </button>
        </div>
      </section>
    </div>
  );
}
