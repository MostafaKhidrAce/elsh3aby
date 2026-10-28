"use client";

import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { useLoginRequired } from "@/components/auth/RouteGuard";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { EventCardView } from "@/lib/api/website-view";

type EventsSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
  title: string;
  description: string;
  cta: string;
  events: EventCardView[];
};

export function EventsSection({
  locale,
  dictionary,
  title,
  description,
  cta,
  events,
}: EventsSectionProps) {
  const t = dictionary.home.eventsSection;
  const isAr = locale === "ar";
  const { isAuthenticated } = useAuth();
  const { openLoginRequired } = useLoginRequired();

  return (
    <section
      id="events-section"
      className="rounded-[20px] px-3 py-8 text-white sm:px-5 sm:py-12 lg:px-10 lg:py-20"
      style={{ backgroundColor: "#133D3C" }}
    >
      <div className="mx-auto grid w-full max-w-7xl items-start gap-8 xl:max-w-[1400px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 xl:gap-16">
        <div className="flex flex-col lg:pt-2">
          <h2 className="text-[24px] font-bold leading-tight sm:text-[28px] md:text-[32px] lg:text-[46px]">
            {title}
          </h2>
          <p className="mt-3 max-w-md text-[15px] font-medium leading-7 text-white/90 sm:mt-4 sm:text-[17px] sm:leading-8 lg:text-[20px] lg:leading-9">
            {description}
          </p>

          {!isAuthenticated ? (
            <button
              type="button"
              dir="ltr"
              onClick={openLoginRequired}
              className="mt-6 inline-flex w-fit items-center justify-center gap-2 rounded-md bg-gold px-4 py-2.5 text-[15px] font-medium text-[#133D3C] transition hover:brightness-105 sm:mt-7 sm:text-[17px] lg:mt-8 lg:px-5 lg:py-3 lg:text-[20px]"
            >
              {isAr ? (
                <>
                  <Image
                    src="/arrows/green-left-arrow.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                  <span>{cta}</span>
                </>
              ) : (
                <>
                  <span>{cta}</span>
                  <Image
                    src="/arrows/green-left-arrow.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 -scale-x-100"
                  />
                </>
              )}
            </button>
          ) : null}
        </div>

        <div className="flex flex-col">
          {events.length === 0 ? (
            <p className="text-[15px] font-medium text-white/80 sm:text-[17px] lg:text-[18px]">
              {t.empty}
            </p>
          ) : (
            events.map((event, index) => (
            <article
              key={event.id}
              className={`flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-5 sm:py-6 lg:gap-6 lg:py-7 ${
                index < events.length - 1 ? "border-b border-white/15" : ""
              }`}
            >
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[10px] bg-white/10 sm:w-[200px] lg:w-[240px]">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 240px"
                  />
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5 px-1 py-1 sm:gap-3 sm:px-3 sm:py-3">
                <div>
                  <h3 className="text-[17px] font-bold leading-snug sm:text-[18px] lg:text-[20px]">
                    {event.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[14px] font-medium leading-6 text-white/80 sm:mt-2 sm:text-[15px] sm:leading-7 lg:text-[16px]">
                    {event.description}
                  </p>
                </div>

                    {event.date || event.location ? (
                    <div className="border-t border-white/15 pt-2.5 sm:pt-3">
                      <div className="flex flex-col gap-2 text-[13px] text-white/75 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2 sm:text-[14px]">
                        {event.date ? (
                        <span className="inline-flex items-center gap-2">
                          <Calendar
                            className="h-4 w-4 shrink-0 text-gold"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                          <span dir="ltr">{event.date}</span>
                        </span>
                        ) : null}
                        {event.location ? (
                        <span className="inline-flex items-start gap-2 sm:items-center">
                          <MapPin
                            className="mt-0.5 h-4 w-4 shrink-0 text-gold sm:mt-0"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                          <span>{event.location}</span>
                        </span>
                        ) : null}
                      </div>
                    </div>
                    ) : null}
              </div>
            </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
