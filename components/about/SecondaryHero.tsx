import Link from "next/link";
import { HeroNav } from "@/components/layout/HeroNav";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type SecondaryHeroProps = {
  locale: Locale;
  dictionary: Dictionary;
  title: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  backgroundUrl?: string | null;
};

const HERO_BG = "/backgrounds/secondryherosection.svg";

export function SecondaryHero({
  locale,
  dictionary,
  title,
  breadcrumbHome,
  breadcrumbCurrent,
  backgroundUrl,
}: SecondaryHeroProps) {
  return (
    <section className="relative max-w-full overflow-hidden rounded-[1.25rem] text-white sm:rounded-[1.75rem]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundUrl || HERO_BG})` }}
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[240px] max-w-full flex-col sm:min-h-[280px] lg:min-h-[360px]">
        <HeroNav locale={locale} dictionary={dictionary} />

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-3 pb-6 pt-3 text-center sm:px-5 sm:pb-8 sm:pt-4 lg:px-6 lg:pb-12">
          <h1 className="max-w-full text-[28px] font-bold leading-tight sm:text-[36px] lg:text-[50px]">
            {title}
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="mt-2 max-w-full text-[16px] font-medium text-white/95 sm:mt-3 sm:text-[20px] lg:text-[26px]"
          >
            <ol className="flex flex-wrap items-center justify-center gap-2">
              <li>
                <Link
                  href={`/${locale}/home`}
                  className="transition hover:text-gold"
                >
                  {breadcrumbHome}
                </Link>
              </li>
              <li aria-hidden className="opacity-80">
                /
              </li>
              <li aria-current="page">{breadcrumbCurrent}</li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
