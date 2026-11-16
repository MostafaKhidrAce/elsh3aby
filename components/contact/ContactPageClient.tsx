"use client";

import { useEffect, useState } from "react";
import { SecondaryHero } from "@/components/about/SecondaryHero";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactInfoSection } from "@/components/contact/ContactInfoSection";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { WebsitePageLoading } from "@/components/layout/WebsitePageLoading";
import { getMessageTypes, getWebsiteContact } from "@/lib/api/website";
import type { MessageType, WebsiteContactData } from "@/lib/api/website";
import { toContactFormView, toContactInfoView } from "@/lib/api/website-view";

type ContactPageClientProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function ContactPageClient({ locale, dictionary }: ContactPageClientProps) {
  const [contact, setContact] = useState<WebsiteContactData | null>(null);
  const [messageTypes, setMessageTypes] = useState<MessageType[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getWebsiteContact(locale), getMessageTypes(locale)])
      .then(([nextContact, nextTypes]) => {
        if (cancelled) return;
        setContact(nextContact);
        setMessageTypes(nextTypes);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (!loaded) {
    return <WebsitePageLoading label={dictionary.common.loading} />;
  }

  const t = dictionary.contact;
  const info = toContactInfoView(locale, dictionary, contact);
  const form = toContactFormView(locale, dictionary, contact, messageTypes);

  return (
    <div className="overflow-x-hidden bg-white p-2 sm:p-3 md:p-4 lg:p-6">
      <SecondaryHero
        locale={locale}
        dictionary={dictionary}
        title={info.heroTitle}
        breadcrumbHome={t.breadcrumbHome}
        breadcrumbCurrent={t.breadcrumbCurrent}
        backgroundUrl={contact?.hero?.background_url}
      />

      <section className="mt-2 rounded-[20px] bg-white px-3 py-8 sm:mt-3 sm:px-6 sm:py-12 md:mt-4 lg:mt-6 lg:px-10 lg:py-14">
        <ContactInfoSection
          locale={locale}
          dictionary={dictionary}
          data={info}
        />
        <ContactFormSection
          locale={locale}
          dictionary={dictionary}
          data={form}
        />
      </section>
    </div>
  );
}
