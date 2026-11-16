"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { SecondaryHero } from "@/components/about/SecondaryHero";
import { WebsitePageLoading } from "@/components/layout/WebsitePageLoading";
import type { ApiMeta } from "@/lib/api/client";
import {
  getPublicEvents,
  getPublicNews,
  type PublicListQuery,
} from "@/lib/api/website";
import { toPublicEventView, toPublicNewsView } from "@/lib/api/public-view";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type CatalogKind = "news" | "events";

type PublicCatalogProps = {
  locale: Locale;
  dictionary: Dictionary;
  kind: CatalogKind;
};

type Card = {
  id: number;
  title: string;
  body: string;
  imageUrl: string;
  date: string;
  location?: string;
  booker?: string;
};

const GREEN = "#133D3C";
const GOLD = "#D5AF34";

function pageCount(meta: ApiMeta | null, fallback: number): number {
  if (meta?.last_page && meta.last_page > 0) return meta.last_page;
  return fallback;
}

export function PublicCatalog({ locale, dictionary, kind }: PublicCatalogProps) {
  const t = dictionary.publicPages;
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAr = locale === "ar";
  const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
  const search = searchParams.get("search") || "";
  const scope = searchParams.get("scope") || "all";
  const date = searchParams.get("date") || "";
  const typeId = searchParams.get("type_id") || "";
  const branch = searchParams.get("branch") || "";
  const [cards, setCards] = useState<Card[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [draftSearch, setDraftSearch] = useState(search);

  useEffect(() => {
    setDraftSearch(search);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    const query: PublicListQuery = {
      page,
      per_page: 9,
      search,
      type_id: typeId || undefined,
      date: kind === "events" ? date || undefined : undefined,
      scope: kind === "events" ? scope || undefined : undefined,
      branch: kind === "events" ? branch || undefined : undefined,
    };
    const request =
      kind === "news" ? getPublicNews(locale, query) : getPublicEvents(locale, query);
    request
      .then((result) => {
        if (cancelled) return;
        const nextCards =
          kind === "news"
            ? result.items.map((item) => {
                const view = toPublicNewsView(item, locale);
                return {
                  id: view.id,
                  title: view.title,
                  body: view.body,
                  imageUrl: view.imageUrl,
                  date: view.date,
                };
              })
            : result.items.map((item) => {
                const view = toPublicEventView(item, locale);
                return {
                  id: view.id,
                  title: view.title,
                  body: view.description,
                  imageUrl: view.imageUrl,
                  date: view.date,
                  location: view.location,
                  booker: view.booker,
                };
              });
        setCards(nextCards);
        setMeta(result.meta);
        setUnavailable(result.unavailable);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [branch, date, kind, locale, page, scope, search, typeId]);

  function pushQuery(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    const qs = params.toString();
    const base = kind === "news" ? `/${locale}/home/news` : `/${locale}/home/events`;
    router.push(qs ? `${base}?${qs}` : base);
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    pushQuery({ search: draftSearch.trim(), page: "1" });
  }

  const lastPage = pageCount(meta, cards.length ? 1 : 0);
  const title = kind === "news" ? t.newsTitle : t.eventsTitle;
  const detailBase = kind === "news" ? `/${locale}/home/news` : `/${locale}/home/events`;

  return (
    <div className="overflow-x-hidden bg-white p-2 sm:p-3 md:p-4 lg:p-6">
      <SecondaryHero
        locale={locale}
        dictionary={dictionary}
        title={title}
        breadcrumbHome={dictionary.about.breadcrumbHome}
        breadcrumbCurrent={title}
      />

      <section className="mt-4 rounded-[20px] bg-white px-3 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        <form
          onSubmit={onSearch}
          className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-sm font-semibold" style={{ color: GREEN }}>
              {t.searchLabel}
            </span>
            <input
              value={draftSearch}
              onChange={(event) => setDraftSearch(event.target.value)}
              placeholder={t.searchPlaceholder}
              className="h-12 rounded-xl border border-[#D5AF34] px-4 text-sm outline-none"
            />
          </label>
          {kind === "events" ? (
            <>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold" style={{ color: GREEN }}>
                  {t.scopeLabel}
                </span>
                <select
                  value={scope}
                  onChange={(event) =>
                    pushQuery({ scope: event.target.value, page: "1" })
                  }
                  className="h-12 rounded-xl border border-[#D5AF34] bg-white px-3 text-sm"
                >
                  <option value="all">{t.scopeAll}</option>
                  <option value="upcoming">{t.scopeUpcoming}</option>
                  <option value="past">{t.scopePast}</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold" style={{ color: GREEN }}>
                  {t.dateLabel}
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    pushQuery({ date: event.target.value, page: "1" })
                  }
                  className="h-12 rounded-xl border border-[#D5AF34] bg-white px-3 text-sm"
                />
              </label>
            </>
          ) : null}
          <button
            type="submit"
            className="h-12 rounded-xl px-5 text-sm font-bold text-[#133D3C]"
            style={{ backgroundColor: GOLD }}
          >
            {t.search}
          </button>
        </form>

        {!loaded ? (
          <WebsitePageLoading label={dictionary.common.loading} />
        ) : unavailable ? (
          <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-7 text-[#426463]">
            {t.unavailable}
          </p>
        ) : cards.length === 0 ? (
          <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-7 text-[#426463]">
            {t.empty}
          </p>
        ) : (
          <div className="mx-auto mt-8 grid w-full max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Link
                key={card.id}
                href={`${detailBase}/${card.id}`}
                className="flex h-full flex-col overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white shadow-[0_2px_12px_rgba(25,33,61,0.04)] transition hover:-translate-y-0.5"
              >
                <div className="relative aspect-[16/10] bg-[#F6EFE7]">
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5" dir={isAr ? "rtl" : "ltr"}>
                  <h2 className="text-lg font-bold leading-snug" style={{ color: GREEN }}>
                    {card.title}
                  </h2>
                  {card.body ? (
                    <p className="line-clamp-3 text-sm leading-6 text-[#426463]">{card.body}</p>
                  ) : null}
                  {card.booker ? (
                    <p className="text-sm text-[#426463]">
                      {t.bookedBy}: {card.booker}
                    </p>
                  ) : null}
                  <p className="mt-auto pt-2 text-xs text-[#8B8B9A]">
                    {[card.date, card.location].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {loaded && !unavailable && lastPage >= 1 ? (
          <div className="mx-auto mt-8 flex max-w-7xl items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => pushQuery({ page: String(page - 1) })}
              className="rounded-lg border border-[#D5AF34] px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              {t.previous}
            </button>
            <span className="px-2 text-sm text-[#426463]">
              {page} / {lastPage}
            </span>
            <button
              type="button"
              disabled={page >= lastPage}
              onClick={() => pushQuery({ page: String(page + 1) })}
              className="rounded-lg border border-[#D5AF34] px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              {t.next}
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
