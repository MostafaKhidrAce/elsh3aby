import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import {
  formatEventDate,
  parseStatNumber,
  pickLocalized,
  resolveCmsImage,
  splitParagraphs,
  toImageList,
} from "@/lib/api/localized";
import type {
  MessageType,
  WebsiteAboutData,
  WebsiteContactData,
  WebsiteFooter,
  WebsiteHomeData,
  WebsiteMenuLink,
  WebsiteSocial,
} from "@/lib/api/website";
import { swapOccasionTitle, normalizeLabel } from "@/lib/api/event-display";
import { websiteMenuHref } from "@/lib/api/website-routes";

const FALLBACK_HERO_BACKGROUNDS = [
  "/backgrounds/hero-section-bg-1.jpg",
  "/backgrounds/hero-section-bg.svg",
  "/backgrounds/hero-section-bg-3.jpg",
];

export type HomeHeroSlideView = {
  background: string;
  title: string;
  subtitle: string;
};

export type HomeHeroView = {
  slides: HomeHeroSlideView[];
  cta1: { label: string; url: string | null };
  cta2: { label: string };
  stats: { id: string | number; label: string; value: number; moreThan: string }[];
};

export type AboutTeaserView = {
  eyebrow: string;
  title: string;
  body: string;
  email: string;
  phone: string;
  cta: string;
};

export type ServiceCardView = {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
};

export type EventCardView = {
  id: string | number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
};

export type NewsCardView = {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
};

export type JoinSectionView = {
  title: string;
  description: string;
  imageUrl: string;
};

export type AboutHeroView = {
  title: string;
  backgroundUrl: string | null;
};

export type LineageView = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export type GoalsView = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

export type QuickStatView = {
  id: string | number;
  value: number;
  label: string;
  suffix: string;
};

export type FaqView = {
  title: string;
  items: { id: string | number; question: string; answer: string }[];
};

export type ContactInfoView = {
  heroTitle: string;
  eyebrow: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
};

export type ContactFormView = {
  title: string;
  description: string;
  mapEmbedUrl: string;
  submitEndpoint: string | null;
  messageTypes: { value: string; label: string }[];
};

export type FooterView = {
  title: string;
  contactCta: string;
  newsletterTitle: string;
  newsletterDesc: string;
  newsletterEndpoint: string | null;
  address: string;
  email: string;
  phone: string;
  copyright: string;
  social: WebsiteSocial;
  menuLinks: { href: string; label: string }[];
};

function hasMoreThanPrefix(value?: string | null): boolean {
  if (!value) return false;
  return /أكثر من|more than/i.test(value);
}

function hasPlusSuffix(value?: string | null): boolean {
  return Boolean(value?.includes("+"));
}

export function toHomeHeroView(
  locale: Locale,
  dictionary: Dictionary,
  home: WebsiteHomeData | null,
): HomeHeroView {
  const t = dictionary.home;
  const hero = home?.hero;
  const sharedTitle = pickLocalized(locale, hero?.title_ar, hero?.title_en, t.title);
  const sharedSubtitle = pickLocalized(
    locale,
    hero?.description_ar,
    hero?.description_en,
    t.subtitle,
  );
  const fromSlides = (hero?.slides ?? [])
    .map((slide, index) => {
      const background = resolveCmsImage(
        slide.background_url,
        FALLBACK_HERO_BACKGROUNDS[index % FALLBACK_HERO_BACKGROUNDS.length],
      );
      const title = pickLocalized(locale, slide.title_ar, slide.title_en, sharedTitle);
      const subtitle = pickLocalized(
        locale,
        slide.description_ar,
        slide.description_en,
        sharedSubtitle,
      );
      if (!slide.background_url && !title && !subtitle) return null;
      return { background, title, subtitle };
    })
    .filter((slide): slide is HomeHeroSlideView => slide !== null);
  const legacyBackgrounds = toImageList(hero?.background_url);
  const slides =
    fromSlides.length > 0
      ? fromSlides
      : (legacyBackgrounds.length > 0
          ? legacyBackgrounds
          : [...FALLBACK_HERO_BACKGROUNDS]
        ).map((background) => ({
          background,
          title: sharedTitle,
          subtitle: sharedSubtitle,
        }));
  return {
    slides,
    cta1: {
      label: pickLocalized(
        locale,
        hero?.cta1?.label_ar,
        hero?.cta1?.label_en,
        t.ctaDownload,
      ),
      url: hero?.cta1?.url ?? null,
    },
    cta2: {
      label: pickLocalized(
        locale,
        hero?.cta2?.label_ar,
        hero?.cta2?.label_en,
        t.ctaJoin,
      ),
    },
    stats:
      hero?.stats && hero.stats.length > 0
        ? hero.stats.map((stat) => {
            const raw = pickLocalized(locale, stat.value_ar, stat.value_en);
            return {
              id: stat.id,
              label: pickLocalized(locale, stat.label_ar, stat.label_en),
              value: parseStatNumber(stat.number ?? raw),
              moreThan: hasMoreThanPrefix(raw) ? t.moreThan : "",
            };
          })
        : [],
  };
}

export function toAboutTeaserView(
  locale: Locale,
  dictionary: Dictionary,
  home: WebsiteHomeData | null,
): AboutTeaserView {
  const t = dictionary.home.aboutSection;
  const teaser = home?.about_teaser;
  return {
    eyebrow: pickLocalized(locale, teaser?.eyebrow_ar, teaser?.eyebrow_en, t.eyebrow),
    title: pickLocalized(locale, teaser?.title_ar, teaser?.title_en, t.title),
    body: pickLocalized(locale, teaser?.body_ar, teaser?.body_en),
    email: teaser?.email || "",
    phone: teaser?.phone || "",
    cta: pickLocalized(
      locale,
      teaser?.button?.label_ar,
      teaser?.button?.label_en,
      t.cta,
    ),
  };
}

export function toServicesView(
  locale: Locale,
  dictionary: Dictionary,
  home: WebsiteHomeData | null,
): {
  eyebrow: string;
  title: string;
  description: string;
  cards: ServiceCardView[];
} {
  const t = dictionary.home.servicesSection;
  const services = home?.services;
  const cards =
    services?.items?.map((item) => ({
      id: item.id,
      title: pickLocalized(locale, item.title_ar, item.title_en),
      description: pickLocalized(
        locale,
        item.description_ar,
        item.description_en,
      ),
      imageUrl: resolveCmsImage(item.image_url, ""),
    })) ?? [];

  const suggestions = cards.find((card) => /اقتراح|suggestion/i.test(card.title));
  const booking = cards.find((card) => /حجز|booking/i.test(card.title));
  if (
    suggestions &&
    booking &&
    normalizeLabel(suggestions.description) === normalizeLabel(booking.description) &&
    suggestions.description.trim()
  ) {
    suggestions.description = t.suggestionsDescription;
  }

  return {
    eyebrow: pickLocalized(
      locale,
      services?.eyebrow_ar,
      services?.eyebrow_en,
      t.title,
    ),
    title: pickLocalized(locale, services?.title_ar, services?.title_en, t.subtitle),
    description: pickLocalized(
      locale,
      services?.description_ar,
      services?.description_en,
      t.description,
    ),
    cards,
  };
}

export function toEventsView(
  locale: Locale,
  dictionary: Dictionary,
  home: WebsiteHomeData | null,
): {
  title: string;
  description: string;
  cta: string;
  events: EventCardView[];
} {
  const t = dictionary.home.eventsSection;
  const section = home?.events_section;
  const events = (section?.items ?? []).map((item) => {
    const heading = swapOccasionTitle(
      pickLocalized(locale, item.title_ar, item.title_en),
      pickLocalized(
        locale,
        item.description_ar ?? item.body_ar,
        item.description_en ?? item.body_en,
      ),
    );
    return {
    id: item.id,
    title: heading.title,
    description: heading.description,
    date: formatEventDate(
      item.date ?? item.start_date ?? item.event_date ?? item.published_at,
    ),
    location:
      item.location?.trim() ||
      pickLocalized(
        locale,
        item.location_ar ?? item.address_ar,
        item.location_en ?? item.address_en,
      ),
    imageUrl: resolveCmsImage(item.image_url || item.icon, ""),
  };
  });

  return {
    title: pickLocalized(locale, section?.title_ar, section?.title_en, t.title),
    description: pickLocalized(
      locale,
      section?.description_ar,
      section?.description_en,
      t.description,
    ),
    cta: pickLocalized(
      locale,
      section?.cta?.label_ar,
      section?.cta?.label_en,
      t.loginCta,
    ),
    events,
  };
}

export function toNewsView(
  locale: Locale,
  dictionary: Dictionary,
  home: WebsiteHomeData | null,
): {
  eyebrow: string;
  title: string;
  description: string;
  cards: NewsCardView[];
} {
  const t = dictionary.home.newsSection;
  const section = home?.news_section;
  const source =
    section?.highlights && section.highlights.length > 0
      ? section.highlights
      : section?.latest && section.latest.length > 0
        ? section.latest
        : null;

  const cards: NewsCardView[] = source
    ? source.map((item) => ({
        id: item.id,
        title: pickLocalized(locale, item.title_ar, item.title_en),
        description: pickLocalized(
          locale,
          item.description_ar ?? item.body_ar,
          item.description_en ?? item.body_en,
        ),
        imageUrl: resolveCmsImage(item.image_url, ""),
      }))
    : [];

  return {
    eyebrow: pickLocalized(locale, section?.eyebrow_ar, section?.eyebrow_en, t.title),
    title: pickLocalized(locale, section?.title_ar, section?.title_en, t.subtitle),
    description: pickLocalized(
      locale,
      section?.description_ar,
      section?.description_en,
      t.description,
    ),
    cards,
  };
}

export function toJoinView(
  locale: Locale,
  dictionary: Dictionary,
  home: WebsiteHomeData | null,
): JoinSectionView {
  const t = dictionary.home.contactSection;
  const join = home?.join;
  return {
    title: pickLocalized(locale, join?.title_ar, join?.title_en, t.title),
    description: pickLocalized(
      locale,
      join?.description_ar,
      join?.description_en,
      t.description,
    ),
    imageUrl: resolveCmsImage(
      join?.image_url,
      "/backgrounds/contact-us-section-bg.svg",
    ),
  };
}

export function toAboutHeroView(
  locale: Locale,
  dictionary: Dictionary,
  about: WebsiteAboutData | null,
): AboutHeroView {
  return {
    title: pickLocalized(
      locale,
      about?.hero?.title_ar,
      about?.hero?.title_en,
      dictionary.about.heroTitle,
    ),
    backgroundUrl: about?.hero?.background_url || null,
  };
}

export function toLineageView(
  locale: Locale,
  dictionary: Dictionary,
  about: WebsiteAboutData | null,
): LineageView {
  const t = dictionary.about.lineageSection;
  const lineage = about?.lineage;
  const body = pickLocalized(locale, lineage?.body_ar, lineage?.body_en);
  return {
    eyebrow: pickLocalized(locale, lineage?.eyebrow_ar, lineage?.eyebrow_en, t.eyebrow),
    title: pickLocalized(locale, lineage?.title_ar, lineage?.title_en, t.title),
    paragraphs: body ? splitParagraphs(body) : [],
  };
}

export function toGoalsView(
  locale: Locale,
  dictionary: Dictionary,
  about: WebsiteAboutData | null,
): GoalsView {
  const t = dictionary.about.goalsSection;
  const aims = about?.aims;
  const points =
    aims?.features && aims.features.length > 0
      ? aims.features.map((feature) =>
          pickLocalized(locale, feature.text_ar, feature.text_en),
        )
      : [];

  return {
    eyebrow: pickLocalized(locale, aims?.eyebrow_ar, aims?.eyebrow_en, t.title),
    title: pickLocalized(locale, aims?.title_ar, aims?.title_en, t.subtitle),
    description: pickLocalized(locale, aims?.body_ar, aims?.body_en, t.description),
    points,
  };
}

export function toQuickStatsView(
  locale: Locale,
  dictionary: Dictionary,
  about: WebsiteAboutData | null,
): {
  eyebrow: string;
  title: string;
  description: string;
  items: QuickStatView[];
} {
  const t = dictionary.about.statsSection;
  const section = about?.quick_stats;
  const items =
    section?.items && section.items.length > 0
      ? section.items.map((item) => {
          const raw = pickLocalized(locale, item.value_ar, item.value_en);
          return {
            id: item.id,
            value: parseStatNumber(item.number ?? raw),
            label: pickLocalized(locale, item.label_ar, item.label_en),
            suffix: hasPlusSuffix(raw) || hasMoreThanPrefix(raw) ? "+" : "",
          };
        })
      : [];

  return {
    eyebrow: pickLocalized(
      locale,
      section?.eyebrow_ar,
      section?.eyebrow_en,
      t.eyebrow,
    ),
    title: pickLocalized(locale, section?.title_ar, section?.title_en, t.title),
    description: pickLocalized(
      locale,
      section?.description_ar,
      section?.description_en,
      t.description,
    ),
    items,
  };
}

export function toFaqView(
  locale: Locale,
  dictionary: Dictionary,
  about: WebsiteAboutData | null,
): FaqView {
  const t = dictionary.about.faqSection;
  const faq = about?.faq;
  const items =
    faq?.items && faq.items.length > 0
      ? faq.items.map((item) => ({
          id: item.id,
          question: pickLocalized(locale, item.question_ar, item.question_en),
          answer: pickLocalized(locale, item.answer_ar, item.answer_en),
        }))
      : [];

  return {
    title: pickLocalized(locale, faq?.title_ar, faq?.title_en, t.title),
    items,
  };
}

export function toContactInfoView(
  locale: Locale,
  dictionary: Dictionary,
  contact: WebsiteContactData | null,
): ContactInfoView {
  const t = dictionary.contact;
  const heroTitle = pickLocalized(
    locale,
    contact?.hero?.title_ar,
    contact?.hero?.title_en,
    t.heroTitle,
  );
  return {
    heroTitle,
    eyebrow: "",
    title: "",
    description: pickLocalized(
      locale,
      contact?.intro_ar,
      contact?.intro_en,
      t.infoSection.description,
    ),
    email: contact?.cards?.email || "",
    phone: contact?.cards?.phone || "",
    address: pickLocalized(
      locale,
      contact?.cards?.address_ar,
      contact?.cards?.address_en,
    ),
  };
}

function embedSrc(value: string): string {
  const match = value.match(/src\s*=\s*["']([^"']+)["']/i);
  return (match?.[1] || value).trim();
}

function contactMapEmbed(
  locale: Locale,
  contact: WebsiteContactData | null,
): string {
  const provided = (contact?.map_embed_url || contact?.cards?.map_embed_url || "").trim();
  if (provided) return embedSrc(provided);
  const address = pickLocalized(
    locale,
    contact?.cards?.address_ar,
    contact?.cards?.address_en,
  );
  if (!address) return "";
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=${locale}&z=15&output=embed`;
}

export function toContactFormView(
  locale: Locale,
  dictionary: Dictionary,
  contact: WebsiteContactData | null,
  messageTypes: MessageType[],
): ContactFormView {
  const t = dictionary.contact.formSection;
  const types = messageTypes.map((item) => ({
    value: String(item.id),
    label: pickLocalized(locale, item.name_ar, item.name_en),
  }));

  return {
    title: pickLocalized(
      locale,
      contact?.form?.title_ar,
      contact?.form?.title_en,
      t.title,
    ),
    description: pickLocalized(
      locale,
      contact?.form?.intro_ar,
      contact?.form?.intro_en,
      t.description,
    ),
    mapEmbedUrl: contactMapEmbed(locale, contact),
    submitEndpoint: contact?.form?.submit_endpoint ?? null,
    messageTypes: types,
  };
}

export function toFooterView(
  locale: Locale,
  dictionary: Dictionary,
  footer: WebsiteFooter | null,
): FooterView {
  const t = dictionary.footer;
  const menuLinks: { href: string; label: string }[] =
    footer?.menu_links && footer.menu_links.length > 0
      ? footer.menu_links.map((link: WebsiteMenuLink) => ({
          href: websiteMenuHref(locale, link),
          label: pickLocalized(locale, link.label_ar, link.label_en),
        }))
      : [
          { href: `/${locale}/home/news`, label: t.menu.news },
          { href: `/${locale}/home/events`, label: t.menu.events },
          { href: `/${locale}/dashboard/market`, label: t.menu.store },
          { href: `/${locale}/dashboard/booking`, label: t.menu.booking },
        ];
  const extraLinks = [
    { href: `/${locale}/home/contact-us`, label: t.contactCta },
    { href: `/${locale}/home/mission`, label: t.menu.mission },
    { href: `/${locale}/home/goals`, label: t.menu.goals },
  ];
  const seen = new Set(menuLinks.map((link) => link.href));
  for (const link of extraLinks) {
    if (!seen.has(link.href)) menuLinks.push(link);
  }

  return {
    title: pickLocalized(
      locale,
      footer?.brand_name_ar,
      footer?.brand_name_en,
      t.title,
    ),
    contactCta: pickLocalized(
      locale,
      footer?.cta?.label_ar,
      footer?.cta?.label_en,
      t.contactCta,
    ),
    newsletterTitle: pickLocalized(
      locale,
      footer?.newsletter?.title_ar,
      footer?.newsletter?.title_en,
      t.newsletterTitle,
    ),
    newsletterDesc: pickLocalized(
      locale,
      footer?.newsletter?.description_ar,
      footer?.newsletter?.description_en,
      t.newsletterDesc,
    ),
    newsletterEndpoint: footer?.newsletter?.subscribe_endpoint ?? null,
    address: pickLocalized(locale, footer?.address_ar, footer?.address_en),
    email: footer?.email || "",
    phone: footer?.phone || "",
    copyright: pickLocalized(
      locale,
      footer?.copyright_ar,
      footer?.copyright_en,
      t.rights,
    ),
    social: footer?.social ?? {},
    menuLinks,
  };
}
