import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { LineageView } from "@/lib/api/website-view";

type AboutLineageSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
  data: LineageView;
};

export function AboutLineageSection({
  locale,
  data,
}: AboutLineageSectionProps) {
  const isAr = locale === "ar";

  return (
    <section
      id="about-lineage-section"
      className="relative overflow-hidden rounded-[1.25rem] bg-white sm:rounded-[1.75rem]"
    >
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-5 px-3 py-6 sm:gap-7 sm:px-5 sm:py-10 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-20 xl:max-w-[1400px] xl:gap-20 xl:px-16">
        <div className={`order-1 min-w-0 ${isAr ? "lg:order-2" : "lg:order-1"}`}>
          <div className="mx-auto w-full max-w-full overflow-hidden">
            <Image
              src="/backgrounds/about-section-bg.svg"
              alt=""
              width={582}
              height={621}
              className="mx-auto h-auto w-full max-w-[620px] object-contain xl:max-w-[680px]"
              priority={false}
            />
          </div>
        </div>

        <div
          className={`order-2 flex min-w-0 flex-col ${
            isAr ? "lg:order-1 text-start" : "lg:order-2 text-start"
          }`}
        >
          <p className="text-sm font-medium text-green-dark lg:text-base">
            {data.eyebrow}
          </p>
          <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-snug text-green-dark sm:mt-3 sm:text-3xl lg:text-[2.75rem] lg:leading-[1.25]">
            {data.title}
          </h2>
          <div className="mt-3 flex max-w-2xl flex-col gap-3 sm:mt-4 sm:gap-4 lg:mt-5 lg:gap-5">
            {data.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-sm font-medium leading-7 text-muted sm:text-base sm:leading-8 lg:text-lg lg:leading-9"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
