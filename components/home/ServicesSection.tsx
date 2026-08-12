"use client";

import Image from "next/image";
import { useLoginRequired } from "@/components/auth/RouteGuard";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type ServicesSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const CARD_IMAGE = "/dummy%20imgs/home%20page/dummy-card-img.svg";

export function ServicesSection({ locale, dictionary }: ServicesSectionProps) {
  const t = dictionary.home.servicesSection;
  const isAr = locale === "ar";
  const { isAuthenticated } = useAuth();
  const { openLoginRequired } = useLoginRequired();

  function handleViewMore() {
    if (!isAuthenticated) {
      openLoginRequired();
    }
  }

  return (
    <section id="services-section" className="w-full">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-12 xl:max-w-[1400px] xl:px-16">
        <div
          className="rounded-[20px] px-3 py-8 sm:px-5 sm:py-12 lg:px-10 lg:py-20"
          style={{ backgroundColor: "#F6EFE7" }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <p
              className="text-[18px] font-medium leading-normal sm:text-[20px] lg:text-[24px]"
              style={{ color: "#133D3C" }}
            >
              {t.title}
            </p>
            <h2
              className="mt-2 text-[24px] font-bold leading-tight sm:mt-3 sm:text-[28px] md:text-[32px] lg:text-[46px]"
              style={{ color: "#133D3C" }}
            >
              {t.subtitle}
            </h2>
            <p
              className="mx-auto mt-3 max-w-3xl text-[15px] font-medium leading-7 sm:mt-4 sm:text-[17px] sm:leading-8 lg:text-[20px] lg:leading-9"
              style={{ color: "#426463" }}
            >
              {t.description}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-3 lg:gap-8">
            {t.cards.map((card) => (
              <article key={card.title} className="flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px]">
                  <Image
                    src={CARD_IMAGE}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <h3
                  className="mt-3 text-[17px] font-bold leading-snug sm:mt-4 sm:text-[18px] lg:text-[20px]"
                  style={{ color: "#133D3C" }}
                >
                  {card.title}
                </h3>
                <p
                  className="mt-2 line-clamp-2 text-[14px] font-normal leading-6 sm:text-[15px] sm:leading-7 lg:text-[16px]"
                  style={{ color: "#133D3C" }}
                >
                  {card.description}
                </p>

                <button
                  type="button"
                  dir="ltr"
                  onClick={handleViewMore}
                  className="mt-3 inline-flex w-fit items-center gap-2 text-[14px] font-medium transition hover:opacity-80 lg:text-[16px]"
                  style={{ color: "#133D3C" }}
                >
                  {isAr ? (
                    <>
                      <Image
                        src="/arrows/green-left-arrow.svg"
                        alt=""
                        width={14}
                        height={14}
                        className="h-3.5 w-3.5"
                      />
                      <span>{t.viewMore}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.viewMore}</span>
                      <Image
                        src="/arrows/green-left-arrow.svg"
                        alt=""
                        width={14}
                        height={14}
                        className="h-3.5 w-3.5 -scale-x-100"
                      />
                    </>
                  )}
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
