"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SecondaryHero } from "@/components/about/SecondaryHero";
import { WebsitePageLoading } from "@/components/layout/WebsitePageLoading";
import { getPublicEvent, getPublicNewsItem } from "@/lib/api/website";
import { toPublicEventView, toPublicNewsView } from "@/lib/api/public-view";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type PublicDetailProps = {
  locale: Locale;
  dictionary: Dictionary;
  kind: "news" | "events";
  id: string;
};

const GREEN = "#133D3C";

export function PublicDetail({ locale, dictionary, kind, id }: PublicDetailProps) {
  const t = dictionary.publicPages;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [metaLine, setMetaLine] = useState("");
  const [missing, setMissing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const listHref = kind === "news" ? `/${locale}/home/news` : `/${locale}/home/events`;
  const listLabel = kind === "news" ? t.backToNews : t.backToEvents;
  const heroTitle = kind === "news" ? t.newsTitle : t.eventsTitle;

  useEffect(() => {
    let cancelled = false;
    const request =
      kind === "news" ? getPublicNewsItem(locale, id) : getPublicEvent(locale, id);
    request
      .then((item) => {
        if (cancelled) return;
        if (!item) {
          setMissing(true);
          return;
        }
        if (kind === "news") {
          const view = toPublicNewsView(item, locale);
          setTitle(view.title);
          setBody(view.body);
          setImageUrl(view.imageUrl);
          setMetaLine(view.date);
          return;
        }
        const view = toPublicEventView(item, locale);
        setTitle(view.title);
        setBody(view.description);
        setImageUrl(view.imageUrl);
        setMetaLine(
          [view.date, view.location, view.booker ? `${t.bookedBy}: ${view.booker}` : ""]
            .filter(Boolean)
            .join(" · "),
        );
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id, kind, locale, t.bookedBy]);

  return (
    <div className="overflow-x-hidden bg-white p-2 sm:p-3 md:p-4 lg:p-6">
      <SecondaryHero
        locale={locale}
        dictionary={dictionary}
        title={title || heroTitle}
        breadcrumbHome={dictionary.about.breadcrumbHome}
        breadcrumbCurrent={title || heroTitle}
      />
      <article className="mx-auto mt-4 w-full max-w-4xl rounded-[20px] bg-white px-4 py-8 sm:px-8 sm:py-12">
        <Link href={listHref} className="text-sm font-semibold text-[#D5AF34]">
          {listLabel}
        </Link>
        {!loaded ? (
          <WebsitePageLoading label={dictionary.common.loading} />
        ) : missing ? (
          <p className="mt-8 text-base leading-7 text-[#426463]">{t.unavailable}</p>
        ) : (
          <div className="mt-6">
            {imageUrl ? (
              <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-[16px] bg-[#F6EFE7]">
                <Image src={imageUrl} alt="" fill className="object-cover" sizes="896px" />
              </div>
            ) : null}
            <h2 className="text-2xl font-bold leading-snug sm:text-3xl" style={{ color: GREEN }}>
              {title}
            </h2>
            {metaLine ? <p className="mt-3 text-sm text-[#8B8B9A]">{metaLine}</p> : null}
            {body ? (
              <p className="mt-6 whitespace-pre-line text-base leading-8 text-[#133D3C]">{body}</p>
            ) : null}
          </div>
        )}
      </article>
    </div>
  );
}
