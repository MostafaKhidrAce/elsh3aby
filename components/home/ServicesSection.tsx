import Image from "next/image";
import type { ServiceCardView } from "@/lib/api/website-view";

type ServicesSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  cards: ServiceCardView[];
};

export function ServicesSection({
  eyebrow,
  title,
  description,
  cards,
}: ServicesSectionProps) {
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
              {eyebrow}
            </p>
            <h2
              className="mt-2 text-[24px] font-bold leading-tight sm:mt-3 sm:text-[28px] md:text-[32px] lg:text-[46px]"
              style={{ color: "#133D3C" }}
            >
              {title}
            </h2>
            <p
              className="mx-auto mt-3 max-w-3xl text-[15px] font-medium leading-7 sm:mt-4 sm:text-[17px] sm:leading-8 lg:text-[20px] lg:leading-9"
              style={{ color: "#426463" }}
            >
              {description}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-3 lg:gap-8">
            {cards.map((card) => (
              <article key={card.id} className="flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#EDE4D6]">
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : null}
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
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
