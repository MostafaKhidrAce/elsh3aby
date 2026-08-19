# Website & App API Integration Report

Base URL: `{BASE_URL}/api/v1`  
Example: `https://family-box.aksapp.com/api/v1`

Auth header (when required): `Authorization: Bearer {token}`  
Locale header (optional): `X-localization: ar|en`

---

## 1) NEW public Website CMS APIs (no auth)

Use these for the **marketing website** Home / About / Contact pages.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/website/home` | Home page CMS + featured events (no footer) |
| `GET` | `/website/about` | About page CMS + FAQs embedded (no footer) |
| `GET` | `/website/contact` | Contact page CMS + map (no footer) |
| `GET` | `/website/footer` | Shared footer for all website pages |
| `GET` | `/website/faqs` | FAQ list only |
| `POST` | `/website/newsletter` | Subscribe email `{ "email": "user@example.com" }` |

### Response envelope

```json
{
  "data": { },
  "message": "...",
  "status_code": 200
}
```

### `GET /website/home` — main keys

- `hero` — slider `background_url[]`, titles, CTAs (`cta2` has no URL), `stats[]` with `number`
- `about_teaser` — copy, experience badge, email/phone from Settings (no button URL, no images)
- `services` — header + `items[]` with `image_url` only (no `link_url`)
- `events_section` — header/CTA (no URL) + `items[]` from **Events** DB (max 3 published)
- `news_section` — header + `highlights[]` only (CMS; no `latest[]`, no `link_url`)
- `join` — text only (no image)

See **`docs/website-home-api-changes-for-frontend.md`** for the full frontend migration guide.

### `GET /website/about` — main keys

- `hero`, `lineage` (no images), `aims` (+ `features[]`, no images), `quick_stats` (+ `items[]` with `number`), `faq` (+ `items[]`)

### `GET /website/footer` — main keys

- `brand_name_*`, `cta` (labels only), `address_*`, `email`, `phone`, `social`, `menu_links[]` (labels only), `newsletter`, `copyright_*`

### `GET /website/contact` — main keys

- `hero`, `intro_*`, `form` (includes existing submit endpoints), `cards` (email/phone/address), `map_embed_url`

### Contact form on website (existing API — keep using)

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| `GET` | `/message-types` | No | — |
| `POST` | `/contact` | No | `name`, `phone`, `email?`, `message_type_id`, `message` / `subject` |

`GET /website/contact` → `data.form.submit_endpoint` and `message_types_endpoint` point to these.

---

## 2) EXISTING APIs to reuse for other website pages

These already exist for the mobile app. Use the **same endpoints** for matching website pages (Events, News, Store, Excellence, Bookings, etc.). Do **not** rebuild them.

### Public (no auth)

| Method | Endpoint | Notes |
|--------|----------|-------|
| `GET` | `/app-settings` | Splash, home text, social, feature flags |
| `GET` | `/banners` | Home/app banners |
| `GET` | `/terms-and-conditions` | Legal |
| `GET` | `/privacy-policy` | Legal |
| `GET` | `/elections-terms-and-conditions` | Elections legal |
| `GET` | `/family-branches` | Registration |
| `GET` | `/cities` | Registration |
| `GET` | `/message-types` | Contact form types |
| `POST` | `/contact` | Contact form submit |
| `GET` | `/discount-types` | Store discounts meta |
| `GET` | `/consultant-types` | Consultations meta |
| `POST` | `/login` / `/register` / `/refresh` | Auth |

### Authenticated (Bearer required) — same as mobile

| Area | Endpoints (examples) |
|------|----------------------|
| Home (app) | `GET /home` |
| About (app/mobile simple) | `GET /about` |
| News | `GET /news`, `GET /news/{id}`, comments |
| Events | `GET /events`, reservations, comments |
| Products / Store | `GET /products`, orders |
| Discount offers | `GET /discount-offers` |
| Books / library | `GET /books` |
| Excellence | excellence members/types |
| Place bookings | place-bookings, booking-types, slots |
| Donations | donation-types, donations |
| Profile / settings | `/profile`, `/settings` |
| Bank accounts (app display) | `GET /bank-accounts` (informational only) |
| Subscriptions | subscriptions |
| Help / consultations | help-orders, consultations |

> Note: Mobile `GET /about` and `GET /home` stay unchanged. Website pages use `/website/*` instead.

---

## 3) Dashboard control map

| Website section | Dashboard location |
|-----------------|-------------------|
| Home (hero, services, highlights, headers…) | **Website → Home page** `/website/home` |
| About (lineage, aims, stats, FAQ title) | **Website → About page** `/website/about` |
| FAQs items | **Website → FAQs** `/website/faqs` |
| Contact page + map | **Website → Contact page** `/website/contact` |
| Footer (brand, menu, newsletter, copyright) | **Website → Footer** `/website/footer` |
| Newsletter subscribers | **Website → Newsletter** `/website/newsletter` |
| Email / phone / social | Existing **Setting** `/setting` |
| Contact form inbox | Existing **Contact us** `/contact-us` |
| Message types dropdown | Existing **Message Types** |
| News / Events / Store / etc. | Existing dashboard modules (unchanged) |

---

## 4) Deploy steps for backend

```bash
php artisan migrate
php artisan db:seed --class=WebsiteCmsSeeder
php artisan storage:link   # if not already
```

Then fill images/copy from **Website** menu in admin.

---

## 5) Quick frontend integration checklist

1. Home page → `GET /website/home`
2. About page → `GET /website/about`
3. Contact page → `GET /website/contact` + submit via `POST /contact`
4. Newsletter field → `POST /website/newsletter`
5. Footer → `GET /website/footer` (once in layout; not embedded in other website GETs)
6. Events/News listing pages → existing `/events`, `/news` (auth as required by app)
7. Prefer AR/EN fields based on `X-localization` / site locale
