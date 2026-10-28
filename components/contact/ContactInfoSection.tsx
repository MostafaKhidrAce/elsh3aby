import { Mail, MapPin, Phone } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { ContactInfoView } from "@/lib/api/website-view";

type ContactInfoSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
  data: ContactInfoView;
};

const TEXT = "#133D3C";

export function ContactInfoSection({
  locale,
  dictionary,
  data,
}: ContactInfoSectionProps) {
  const t = dictionary.contact.infoSection;
  const isAr = locale === "ar";

  const textBlock = (
    <div dir={isAr ? "rtl" : "ltr"}>
      <p
        className="text-[16px] font-medium sm:text-[18px] lg:text-[20px]"
        style={{ color: TEXT }}
      >
        {data.eyebrow}
      </p>
      <h2
        className="mt-2 text-[28px] font-bold leading-tight sm:text-[36px] lg:text-[42px]"
        style={{ color: TEXT }}
      >
        {data.title}
      </h2>
      <p
        className="mt-4 max-w-xl text-[15px] font-normal leading-7 sm:text-[17px] sm:leading-8 lg:text-[18px] lg:leading-9"
        style={{ color: TEXT }}
      >
        {data.description}
      </p>
    </div>
  );

  const cardsBlock = (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
    >
      {data.phone ? (
      <article className="rounded-[14px] border border-[#E5E5E5] bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5]"
            style={{ color: TEXT }}
          >
            <Phone className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0" style={{ color: TEXT }}>
            <p className="text-[13px] sm:text-[14px]">{t.phoneLabel}</p>
            <a
              href={`tel:${data.phone.replace(/-/g, "")}`}
              className="mt-1 block text-[15px] font-semibold sm:text-[16px]"
              dir="ltr"
            >
              {data.phone}
            </a>
          </div>
        </div>
      </article>
      ) : null}

      {data.email ? (
      <article className="rounded-[14px] border border-[#E5E5E5] bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5]"
            style={{ color: TEXT }}
          >
            <Mail className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0" style={{ color: TEXT }}>
            <p className="text-[13px] sm:text-[14px]">{t.emailLabel}</p>
            <a
              href={`mailto:${data.email}`}
              className="mt-1 block truncate text-[15px] font-semibold sm:text-[16px]"
            >
              {data.email}
            </a>
          </div>
        </div>
      </article>
      ) : null}

      {data.address ? (
      <article className="rounded-[14px] border border-[#E5E5E5] bg-white p-5 sm:col-span-2 sm:p-6">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5]"
            style={{ color: TEXT }}
          >
            <MapPin className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0" style={{ color: TEXT }}>
            <p className="text-[13px] sm:text-[14px]">{t.addressLabel}</p>
            <p className="mt-1 text-[15px] font-semibold sm:text-[16px]">
              {data.address}
            </p>
          </div>
        </div>
      </article>
      ) : null}
    </div>
  );

  return (
    <section
      id="contact-info-section"
      className="overflow-hidden rounded-[20px] bg-white px-3 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-20"
    >
      <div
        dir="ltr"
        className="mx-auto grid w-full max-w-7xl items-center gap-8 xl:max-w-[1400px] lg:grid-cols-2 lg:gap-12 xl:gap-16"
      >
        {isAr ? (
          <>
            {cardsBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {cardsBlock}
          </>
        )}
      </div>
    </section>
  );
}
