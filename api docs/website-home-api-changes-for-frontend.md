# Website CMS APIs — Frontend Integration Guide

**Base URL:** `{BASE_URL}/api/v1`  
**Auth:** None  
**Optional header:** `X-localization: ar|en`

This document covers the updated **Home**, **About**, and **Footer** website endpoints. Several keys were removed because those actions are **internal SPA routes** on the marketing site (not external URLs from the API).

---

## Endpoints overview

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/website/home` | Home page sections only (no footer) |
| `GET` | `/website/about` | About page sections only (no footer) |
| `GET` | `/website/contact` | Contact page only (no footer) |
| `GET` | `/website/footer` | **Shared footer** for all pages |
| `GET` | `/website/faqs` | FAQ list only |
| `POST` | `/website/newsletter` | Newsletter subscribe |

**Important:** Footer was removed from `/website/home`, `/website/about`, and `/website/contact`. Fetch footer once (e.g. in layout) from `/website/footer`.

---

## Home page — `GET /website/home`

### Summary of changes

| Section | Change |
|---------|--------|
| `hero.background_url` | Now an **array** of image URLs (slider) |
| `hero.cta2` | **No `url`** — navigate internally (e.g. join/register) |
| `hero.stats[]` | **`number`** field; **`icon_url`**, `value_ar`, `value_en` removed |
| `about_teaser.button` | **No `url`** — navigate to `/about` internally |
| `about_teaser` | **`images` array removed** |
| `services.items[]` | **`link_url` removed**; use **`image_url`** |
| `events_section.cta` | **No `url`** — navigate internally (e.g. login) |
| `events_section.items[]` | Up to **3** published events from backend |
| `news_section.highlights[]` | **`link_url` removed** |
| `news_section` | **`latest` array removed** |
| `join` | **`image_url` removed** |
| `footer` | **Removed** — use `/website/footer` |

### Example (abbreviated)

```json
{
  "data": {
    "hero": {
      "background_url": [
        "https://example.com/storage/website/home/slide-1.jpg",
        "https://example.com/storage/website/home/slide-2.jpg"
      ],
      "title_ar": "...",
      "title_en": "...",
      "cta1": { "label_ar": "...", "label_en": "...", "url": "https://..." },
      "cta2": { "label_ar": "...", "label_en": "..." },
      "stats": [
        { "id": 1, "label_ar": "سنوات من التراث", "label_en": "Years of heritage", "number": 100 }
      ]
    },
    "about_teaser": { "button": { "label_ar": "...", "label_en": "..." } },
    "services": { "items": [{ "id": 1, "title_ar": "...", "image_url": "https://..." }] },
    "events_section": { "cta": { "label_ar": "...", "label_en": "..." }, "items": [] },
    "news_section": { "highlights": [{ "id": 1, "title_ar": "...", "image_url": "https://..." }] },
    "join": { "title_ar": "...", "title_en": "...", "description_ar": "...", "description_en": "..." }
  }
}
```

---

## About page — `GET /website/about`

### Summary of changes

| Section | Change |
|---------|--------|
| `lineage` | **`images` array removed** |
| `aims` | **`images` array removed** |
| `quick_stats.items[]` | **`number`** field added; **`value_ar`**, `value_en` removed |
| `footer` | **Removed** — use `/website/footer` |

### Example (abbreviated)

```json
{
  "data": {
    "hero": {
      "background_url": "https://example.com/storage/website/about/hero.jpg",
      "title_ar": "نسب الأسرة",
      "title_en": "Family Lineage"
    },
    "lineage": {
      "eyebrow_ar": "...",
      "eyebrow_en": "...",
      "title_ar": "...",
      "title_en": "...",
      "body_ar": "...",
      "body_en": "...",
      "experience": {
        "value": "+25",
        "label_ar": "سنوات من الخبرة",
        "label_en": "Years of experience"
      }
    },
    "aims": {
      "eyebrow_ar": "...",
      "eyebrow_en": "...",
      "title_ar": "...",
      "title_en": "...",
      "body_ar": "...",
      "body_en": "...",
      "features": [
        { "id": 1, "text_ar": "...", "text_en": "..." }
      ]
    },
    "quick_stats": {
      "eyebrow_ar": "...",
      "eyebrow_en": "...",
      "title_ar": "...",
      "title_en": "...",
      "description_ar": "...",
      "description_en": "...",
      "items": [
        {
          "id": 1,
          "number": 3000,
          "label_ar": "اجمالي عدد أفراد الأسرة",
          "label_en": "Total family members"
        }
      ]
    },
    "faq": {
      "title_ar": "...",
      "title_en": "...",
      "items": [
        { "id": 1, "question_ar": "...", "question_en": "...", "answer_ar": "...", "answer_en": "..." }
      ]
    }
  }
}
```

### Quick stats rendering

- Use `item.number` for the counter (same pattern as home hero stats).
- Use `item.label_ar` / `item.label_en` as the caption.
- Do **not** expect `value_ar` or `value_en`.

---

## Footer — `GET /website/footer` (NEW)

Load this once in your site layout and reuse on every page.

### Response shape

```json
{
  "data": {
    "brand_name_ar": "عائلة الشعيبي بالأحساء",
    "brand_name_en": "Al-Shuaibi Family in Al-Ahsa",
    "cta": {
      "label_ar": "تواصل معنا",
      "label_en": "Contact Us"
    },
    "address_ar": "...",
    "address_en": "...",
    "email": "info@example.com",
    "phone": "+966...",
    "social": {
      "whatsapp": "...",
      "facebook": "...",
      "instagram": "...",
      "x": "...",
      "snapchat": "..."
    },
    "menu_links": [
      { "label_ar": "أخبار العائلة", "label_en": "Family News" },
      { "label_ar": "الفعاليات والمناسبات", "label_en": "Events" }
    ],
    "newsletter": {
      "title_ar": "...",
      "title_en": "...",
      "description_ar": "...",
      "description_en": "...",
      "subscribe_endpoint": "https://example.com/api/v1/website/newsletter"
    },
    "copyright_ar": "...",
    "copyright_en": "..."
  }
}
```

### Internal navigation

| UI element | Suggested route |
|------------|-----------------|
| `cta` | `/contact` |
| `menu_links[]` | Map by `label_en` / `label_ar` to your routes (see below) |

| `label_en` (example) | Route |
|----------------------|-------|
| Family News | `/news` |
| Events | `/events` |
| Qaisariya Market | `/store` |
| Family venue booking | `/bookings` |

`menu_links` has **no `url`** — routing is handled in the frontend.

---

## Contact page — `GET /website/contact`

- **`footer` removed** — use `/website/footer`.
- Other keys unchanged: `hero`, `intro_*`, `form`, `cards`, `map_embed_url`.

---

## Frontend migration checklist

### Layout / app shell

1. Add a single fetch to `GET /website/footer` in your root layout or shared store.
2. Remove footer parsing from home/about/contact API responses.
3. Remove any code reading `data.footer` from those three endpoints.

### Home page

- Hero slider: bind to `hero.background_url[]`.
- Hero stats: use `stat.number` + labels.
- Internal CTAs: `hero.cta2`, `about_teaser.button`, `events_section.cta`.

### About page

- Remove `lineage.images` and `aims.images` usage.
- Quick stats: use `quick_stats.items[].number` + labels.

### Delete unused keys

- `footer` from home / about / contact responses
- `news_section.latest`
- `about_teaser.images`
- `join.image_url`
- `lineage.images`, `aims.images`
- `quick_stats.items[].value_ar`, `value_en`
- All removed `url` / `link_url` fields from previous home changes

---

## Backend seeding (staging/local)

```bash
php artisan migrate
php artisan db:seed --class=WebsiteCmsSeeder
php artisan storage:link
```

---

## Related docs

- `docs/website-api-integration-report.md` — full API catalog
- Admin: **Website → Footer** in dashboard for footer CMS
