"use client";

import Image from "next/image";
import { FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type ContactSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const SECTION_IMAGE = "/backgrounds/contact-us-section-bg.svg";

const inputClassName =
  "w-full rounded-[10px] border-0 bg-[#F7F7F7] p-4 text-[14px] font-normal text-black shadow-none outline-none ring-0 transition placeholder:text-[14px] placeholder:font-normal placeholder:text-[#426463] focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none sm:p-5 sm:text-[16px] sm:placeholder:text-[16px]";

export function ContactSection({ locale, dictionary }: ContactSectionProps) {
  const t = dictionary.home.contactSection;
  const isAr = locale === "ar";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    console.log({
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
    });

    form.reset();
  }

  return (
    <section
      id="contact-us-section"
      className="overflow-hidden rounded-[20px] bg-white px-3 py-8 sm:px-5 sm:py-12 lg:px-10 lg:py-20"
    >
      <div
        className="mx-auto grid w-full max-w-7xl items-stretch gap-6 xl:max-w-[1400px] lg:grid-cols-2 lg:gap-12 xl:gap-16"
        dir="ltr"
      >
        <div className="relative min-h-[240px] overflow-hidden rounded-[20px] sm:min-h-[320px] lg:min-h-full">
          <Image
            src={SECTION_IMAGE}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
          />
        </div>

        <div dir={isAr ? "rtl" : "ltr"} className="flex flex-col justify-center">
          <h2
            className="text-[24px] font-bold leading-tight sm:text-[28px] md:text-[32px] lg:text-[46px]"
            style={{ color: "#133D3C" }}
          >
            {t.title}
          </h2>
          <p
            className="mt-3 text-[15px] font-normal leading-7 sm:mt-4 sm:text-[17px] sm:leading-8 lg:text-[20px] lg:leading-9"
            style={{ color: "#426463" }}
          >
            {t.description}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <input
                name="firstName"
                required
                placeholder={t.firstName}
                className={inputClassName}
              />
              <input
                name="lastName"
                required
                placeholder={t.lastName}
                className={inputClassName}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <input
                name="email"
                type="email"
                required
                placeholder={t.email}
                className={inputClassName}
              />
              <input
                name="phone"
                type="text"
                inputMode="tel"
                required
                placeholder={t.phone}
                dir={isAr ? "rtl" : "ltr"}
                className={inputClassName}
              />
            </div>

            <textarea
              name="message"
              required
              rows={5}
              placeholder={t.message}
              className={`${inputClassName} min-h-[120px] resize-none sm:min-h-[140px]`}
            />

            <button
              type="submit"
              className="inline-flex w-fit items-center justify-center rounded-md px-5 py-3 text-[14px] font-medium text-[#133D3C] transition hover:brightness-105 sm:px-6 sm:py-3.5 sm:text-[16px]"
              style={{ backgroundColor: "#D5AF34" }}
            >
              {t.submit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
