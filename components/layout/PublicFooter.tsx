"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { FooterView } from "@/lib/api/website-view";
import { getWebsiteFooter, subscribeNewsletter } from "@/lib/api/website";
import { toFooterView } from "@/lib/api/website-view";
import { websiteContactHref } from "@/lib/api/website-routes";

type PublicFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

function SocialIcon({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/80 text-white transition hover:border-white hover:bg-white/10"
    >
      {children}
    </a>
  );
}

function socialHref(kind: "whatsapp" | "facebook" | "instagram" | "x" | "snapchat", value: string) {
  if (kind === "whatsapp" && !value.startsWith("http")) {
    const digits = value.replace(/\D/g, "");
    return `https://wa.me/${digits}`;
  }
  return value;
}

export function PublicFooter({ locale, dictionary }: PublicFooterProps) {
  const t = dictionary.footer;
  const isAr = locale === "ar";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [data, setData] = useState<FooterView | null>(null);

  useEffect(() => {
    let cancelled = false;
    getWebsiteFooter(locale).then((footer) => {
      if (!cancelled) setData(toFooterView(locale, dictionary, footer));
    });
    return () => {
      cancelled = true;
    };
  }, [locale, dictionary]);

  if (!data) return null;

  const socialItems = [
    data.social.snapchat
      ? {
          label: "Snapchat",
          href: socialHref("snapchat", data.social.snapchat),
          icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.75">
              <path d="M12 3.5c2.4 0 4.2 1.7 4.2 4.3v1.2c0 .4.2.8.5 1.1.7.6 1.3 1.4 1.3 2.4 0 .6-.3 1.1-.9 1.4-.2.1-.3.3-.2.5.2.6.7 1.1 1.3 1.4.3.1.4.5.2.8-.5.7-1.6 1.1-3.1 1.3-.3.5-.9 1.1-1.8 1.5-.4.2-.8.2-1.2.2s-.8 0-1.2-.2c-.9-.4-1.5-1-1.8-1.5-1.5-.2-2.6-.6-3.1-1.3-.2-.3-.1-.7.2-.8.6-.3 1.1-.8 1.3-1.4.1-.2 0-.4-.2-.5-.6-.3-.9-.8-.9-1.4 0-1 .6-1.8 1.3-2.4.3-.3.5-.7.5-1.1V7.8c0-2.6 1.8-4.3 4.2-4.3Z" />
            </svg>
          ),
        }
      : null,
    data.social.instagram
      ? {
          label: "Instagram",
          href: socialHref("instagram", data.social.instagram),
          icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.75">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
            </svg>
          ),
        }
      : null,
    data.social.x
      ? {
          label: "X",
          href: socialHref("x", data.social.x),
          icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M13.6 10.5 19.2 4h-1.5l-4.7 5.4L9 4H4.5l5.9 8.4L4.5 20H6l5.1-5.9L14.9 20H19.4l-5.8-9.5Zm-1.8 2.1-.6-.8-4.7-6.5h2l3.8 5.3.6.8 4.9 6.8h-2l-4-5.6Z" />
            </svg>
          ),
        }
      : null,
    data.social.whatsapp
      ? {
          label: "WhatsApp",
          href: socialHref("whatsapp", data.social.whatsapp),
          icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.75">
              <path d="M20 11.5a8 8 0 0 1-12 6.9L4 19l.7-3.8A8 8 0 1 1 20 11.5Z" />
              <path d="M9.2 9.4c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.4.5c-.1.1-.1.3 0 .5.3.5 1.1 1.3 1.7 1.7.2.1.4.1.5 0l.5-.4c.2-.1.4-.1.5.1l1.5 1c.2.1.3.4.2.6-.2.5-.8 1.1-1.4 1.2-.5.1-1.2 0-2.5-.5-1.5-.6-2.7-1.9-3.4-3.2-.6-1.2-.8-2.1-.7-2.7.1-.5.6-1.1 1.2-1.3Z" />
            </svg>
          ),
        }
      : null,
    data.social.facebook
      ? {
          label: "Facebook",
          href: socialHref("facebook", data.social.facebook),
          icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M14 8.5h2.2V5.8c-.4-.1-1.2-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7v2.1H8v3h2.5V20h3.2v-5.5H16l.5-3h-2.5V9.6c0-.9.2-1.1.5-1.1Z" />
            </svg>
          ),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    setStatus("loading");
    try {
      await subscribeNewsletter(email, data.newsletterEndpoint, locale);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="mt-auto bg-white px-2 pb-2 sm:px-3 sm:pb-3 md:px-4 md:pb-4 lg:px-6 lg:pb-6">
      <div
        className="rounded-[20px] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-12 lg:pb-14 lg:pt-[100px]"
        style={{ backgroundColor: "#133D3C" }}
      >
        <div className="mx-auto w-full max-w-7xl xl:max-w-[1400px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <h2 className="text-[22px] font-bold leading-tight sm:text-[28px] md:text-[32px] lg:text-[42px]">
              {data.title}
            </h2>
            <Link
              href={websiteContactHref(locale)}
              dir="ltr"
              className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[14px] font-medium text-[#133D3C] transition hover:brightness-105 lg:px-5 lg:py-3 lg:text-[16px]"
              style={{ backgroundColor: "#D5AF34" }}
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
                  <span>{data.contactCta}</span>
                </>
              ) : (
                <>
                  <span>{data.contactCta}</span>
                  <Image
                    src="/arrows/green-left-arrow.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 -scale-x-100"
                  />
                </>
              )}
            </Link>
          </div>

          <div className="my-6 h-px w-full bg-white/30 sm:my-8 lg:my-12" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8 xl:gap-12">
            <div>
              <h3 className="text-[16px] font-bold sm:text-[18px] lg:text-[20px]">
                {data.newsletterTitle}
              </h3>
              <p className="mt-2 text-[13px] font-normal leading-6 text-white/85 sm:mt-3 sm:text-[14px] sm:leading-7 lg:text-[15px]">
                {data.newsletterDesc}
              </p>
              {status === "success" ? (
                <p className="mt-5 text-[14px] text-white/90">{t.newsletterSuccess}</p>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  dir="ltr"
                  className="mt-5 flex h-12 items-center overflow-hidden rounded-md border border-white/40 p-1"
                >
                  {isAr ? (
                    <>
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        aria-label={t.newsletterSubmit}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition hover:brightness-105 disabled:opacity-70"
                        style={{ backgroundColor: "#D5AF34" }}
                      >
                        <Send
                          className="h-4 w-4 -scale-x-100 text-black"
                          strokeWidth={2}
                        />
                      </button>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder={t.newsletterPlaceholder}
                        dir="rtl"
                        className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-[14px] text-white outline-none ring-0 placeholder:text-white/60 focus:outline-none focus:ring-0"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder={t.newsletterPlaceholder}
                        className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-[14px] text-white outline-none ring-0 placeholder:text-white/60 focus:outline-none focus:ring-0"
                      />
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        aria-label={t.newsletterSubmit}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition hover:brightness-105 disabled:opacity-70"
                        style={{ backgroundColor: "#D5AF34" }}
                      >
                        <Send className="h-4 w-4 text-black" strokeWidth={2} />
                      </button>
                    </>
                  )}
                </form>
              )}
              {status === "error" ? (
                <p className="mt-2 text-[13px] text-[#FECACA]">{t.newsletterError}</p>
              ) : null}
            </div>

            <div>
              <h3 className="text-[16px] font-bold sm:text-[18px] lg:text-[20px]">
                {t.addressTitle}
              </h3>
              {data.address ? (
              <div className="mt-3 flex items-start gap-3 sm:mt-4">
                <span className="mt-0.5 inline-flex shrink-0 text-white">
                  <MapPin className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <p className="text-[13px] font-normal leading-6 text-white/90 sm:text-[14px] sm:leading-7 lg:text-[15px]">
                  {data.address}
                </p>
              </div>
              ) : null}
              {socialItems.length > 0 ? (
                <>
                  <div className="mt-5 h-px w-full bg-white/30" />
                  <div className="mt-5 flex flex-wrap gap-3">
                    {socialItems.map((item) => (
                      <SocialIcon key={item.label} label={item.label} href={item.href}>
                        {item.icon}
                      </SocialIcon>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <div>
              <h3 className="text-[16px] font-bold sm:text-[18px] lg:text-[20px]">
                {t.menuTitle}
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5 sm:mt-4 sm:gap-3">
                {data.menuLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[13px] font-normal text-white/90 transition hover:text-white sm:text-[14px] lg:text-[15px]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[16px] font-bold sm:text-[18px] lg:text-[20px]">
                {t.contactTitle}
              </h3>
              <div className="mt-4 flex flex-col gap-5">
                {data.phone ? (
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/80">
                    <Phone className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-[13px] text-white/70">{t.phoneLabel}</p>
                    <a
                      href={`tel:${data.phone}`}
                      className="mt-1 block text-[15px] font-medium text-white"
                      dir="ltr"
                    >
                      {data.phone}
                    </a>
                  </div>
                </div>
                ) : null}
                {data.email ? (
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/80">
                    <Mail className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-[13px] text-white/70">{t.emailLabel}</p>
                    <a
                      href={`mailto:${data.email}`}
                      className="mt-1 block text-[15px] font-medium text-white"
                    >
                      {data.email}
                    </a>
                  </div>
                </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/20 pt-6 sm:mt-10 sm:pt-8">
            <p className="text-[13px] font-normal text-white/70 sm:text-[14px]">
              {data.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
