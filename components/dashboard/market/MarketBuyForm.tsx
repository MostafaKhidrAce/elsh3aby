"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Minus, Plus, Store } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { EventsBreadcrumbs } from "@/components/dashboard/events/EventsBreadcrumbs";
import { ApiError } from "@/lib/api/client";
import { createOrder } from "@/lib/api/shop";
import { toApiPhone } from "@/lib/api/localized";
import { useAuth } from "@/lib/auth/auth-context";
import type { MarketProduct } from "@/lib/dashboard/dummy-market";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type MarketBuyFormProps = {
  locale: Locale;
  dictionary: Dictionary;
  product: MarketProduct;
};

const TEXT = "#170F49";
const BORDER = "#E5E5E5";

const inputClassName =
  "h-12 w-full rounded-[12px] border bg-white px-4 text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#D5AF34] sm:h-14 sm:text-[15px]";

const textareaClassName =
  "min-h-[140px] w-full resize-y rounded-[12px] border bg-white px-4 py-3 text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#D5AF34] sm:text-[15px]";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

export function MarketBuyForm({
  locale,
  dictionary,
  product,
}: MarketBuyFormProps) {
  const t = dictionary.dashboard.marketPage;
  const isAr = locale === "ar";
  const router = useRouter();

  const productTitle = isAr ? product.title : product.titleEn;
  const marketHref = `/${locale}/dashboard/market`;
  const detailsHref = `/${locale}/dashboard/market/${product.id}`;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const { token } = useAuth();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !mobile.trim() || !address.trim() || !token) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    try {
      const result = await createOrder(
        {
          name: name.trim(),
          phone: toApiPhone(mobile),
          product_id: Number(product.id),
          quantity,
          shipping_address: address.trim(),
          notes: notes.trim() || undefined,
        },
        locale,
        token,
      );
      const orderId = result.order?.id ?? result.id;
      const params = new URLSearchParams({
        qty: String(quantity),
        name: name.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        location: location.trim(),
        notes: notes.trim(),
      });
      if (orderId) params.set("orderId", String(orderId));
      const redirect = result.payment?.redirect_url || result.edfapay_redirect_url;
      if (redirect) {
        window.location.assign(redirect);
        return;
      }
      router.push(
        `/${locale}/dashboard/market/${product.id}/receipt?${params.toString()}`,
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    }
  }

  const labelClass = "text-[14px] font-bold";
  const fieldGap = "flex flex-col gap-1.5";

  return (
    <div className="space-y-4 sm:space-y-5">
      <header
        className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="space-y-3">
          <Link
            href={detailsHref}
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
                  { label: t.subtitle, href: marketHref },
                  { label: t.detailsBreadcrumb, href: detailsHref },
                  { label: t.buyBreadcrumb },
                ]}
              />
            </div>
          </div>
        </div>
        <UserMenu locale={locale} dictionary={dictionary} />
      </header>

      <section className={cardClass}>
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.name}
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className={inputClassName}
                style={{ color: TEXT, borderColor: BORDER }}
              />
            </label>
            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.mobile}
              </span>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder={t.mobilePlaceholder}
                className={inputClassName}
                style={{ color: TEXT, borderColor: BORDER }}
              />
            </label>
            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.product}
              </span>
              <input
                value={productTitle}
                readOnly
                className={`${inputClassName} bg-[#FAFAFA]`}
                style={{ color: TEXT, borderColor: BORDER }}
              />
            </label>
            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.price}
              </span>
              <input
                value={`${product.price} ${t.currency}`}
                readOnly
                className={`${inputClassName} bg-[#FAFAFA]`}
                style={{ color: TEXT, borderColor: BORDER }}
              />
            </label>
            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.address}
              </span>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.addressPlaceholder}
                className={inputClassName}
                style={{ color: TEXT, borderColor: BORDER }}
              />
            </label>
            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.location}
              </span>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute top-1/2 end-4 h-4 w-4 -translate-y-1/2 text-[#D5AF34]"
                  strokeWidth={2}
                />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t.locationPlaceholder}
                  className={`${inputClassName} pe-11`}
                  style={{ color: TEXT, borderColor: BORDER }}
                />
              </div>
            </label>
          </div>

          <label className={fieldGap}>
            <span className={labelClass} style={{ color: TEXT }}>
              {t.notes}
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className={textareaClassName}
              style={{ color: TEXT, borderColor: BORDER }}
            />
          </label>

          {error ? (
            <p className="text-center text-sm font-medium text-[#E11D48]">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
            <div className="inline-flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F0F0] text-[#170F49] transition hover:brightness-95"
              >
                <Minus className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <span className="min-w-8 text-center text-lg font-bold text-[#170F49]">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase"
                onClick={() => setQuantity((q) => q + 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#D5AF34] text-white transition hover:brightness-95"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
            <button
              type="submit"
              className="inline-flex min-w-[180px] items-center justify-center rounded-[12px] bg-[#D5AF34] px-8 py-3.5 text-base font-bold text-white transition hover:brightness-95"
            >
              {t.payNow}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
