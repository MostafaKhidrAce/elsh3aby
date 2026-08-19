import Image from "next/image";
import { Check } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { GoalsView } from "@/lib/api/website-view";

type AboutGoalsSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
  data: GoalsView;
};

const SECTION_IMAGE = "/backgrounds/aboutus-page1.svg";
const TEXT_COLOR = "#133D3C";

export function AboutGoalsSection({
  locale,
  data,
}: AboutGoalsSectionProps) {
  const isAr = locale === "ar";

  return (
    <section
      id="about-goals-section"
      className="relative overflow-hidden rounded-[1.25rem] bg-white sm:rounded-[1.75rem]"
    >
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-3 py-6 sm:gap-8 sm:px-5 sm:py-10 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-20 xl:max-w-[1400px] xl:gap-20 xl:px-16">
        <div className={`order-1 min-w-0 ${isAr ? "lg:order-2" : "lg:order-1"}`}>
          <div className="mx-auto w-full max-w-full overflow-hidden">
            <Image
              src={SECTION_IMAGE}
              alt=""
              width={640}
              height={560}
              className="mx-auto h-auto w-full max-w-[620px] object-contain xl:max-w-[680px]"
              priority={false}
            />
          </div>
        </div>

        <div
          className={`order-2 flex min-w-0 flex-col ${
            isAr ? "lg:order-1 text-start" : "lg:order-2 text-start"
          }`}
          style={{ color: TEXT_COLOR }}
        >
          <p className="text-[16px] font-medium sm:text-[18px] lg:text-[24px]">
            {data.eyebrow}
          </p>
          <h2 className="mt-2 text-[24px] font-semibold leading-tight sm:mt-3 sm:text-[30px] md:text-[34px] lg:text-[46px]">
            {data.title}
          </h2>
          <p className="mt-3 text-[14px] font-normal leading-7 sm:mt-4 sm:text-[16px] sm:leading-8 lg:text-[20px] lg:leading-9">
            {data.description}
          </p>

          <ul className="mt-5 flex flex-col gap-3 sm:mt-6 sm:gap-3.5 lg:mt-8 lg:gap-4">
            {data.points.map((point, index) => (
              <li key={`${point}-${index}`} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#133D3C] text-white sm:h-7 sm:w-7">
                  <Check
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    strokeWidth={2.5}
                  />
                </span>
                <span className="text-[14px] font-normal leading-7 sm:text-[16px] sm:leading-8 lg:text-[20px] lg:leading-9">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
