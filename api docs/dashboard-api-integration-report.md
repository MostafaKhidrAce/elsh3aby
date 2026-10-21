# Dashboard API integration report

Base URL: `{NEXT_PUBLIC_API_BASE_URL}` (`https://family-box.aksapp.com/api/v1`)  
Do **not** extra-prefix `/v1`.  
Auth: `Authorization: Bearer {token}` + `X-localization: ar|en`  
All dashboard fetches run **client-side** (visible in the Network tab). Dummy list rows are no longer mixed into live screens.

---

## Done

| Method | Path | Screen | Notes |
|--------|------|--------|-------|
| GET | `/events` | Events list | Query `date`, `date_from`, `date_to`, `type_id`, `per_page`. Date slider/calendar send `date=YYYY-MM-DD`. |
| GET | `/event-types` | Events list + add event | Envelope is `{ event_types: [] }` (not `data`). Cards grouped by live type. |
| GET | `/events/{id}` | Event details | Gallery, location, map embed from `lat`/`lng`. |
| GET/POST | `/events/{id}/comments` | Event details | POST FormData `body` + optional `media`. |
| POST | `/events/{id}/rating` | Event cards + details | FormData `{ rating }` (1–5). Shown when `can_rate_event`. |
| POST | `/events/{id}/reminder/toggle` | Event cards | Replaces local `Set`. |
| POST | `/events` | Add event | Multipart: `full_name` / `full_name_ar`, `family_branch_id`, `phone`, `event_date_calendar=gregorian`, `date_from`/`date_to`, `time_from`/`time_to`, descriptions, location, `type_id`, `gallery[]`. |
| GET | `/news` | News list | Query `search`, `type_id`, pagination 15/page + load more. |
| GET | `/news/{id}` | News details | |
| GET/POST | `/news/{id}/comments` | News details | POST FormData `body`. |
| GET | `/help-orders` | Requests → Help | `my_orders_only=true`. |
| POST | `/help-orders` | Add help request | FormData: `type_id`, `full_name`, `national_id`, `geographical_location`, `request_title`, `mobile_number`, `request_description`, `attachment`. |
| GET | `/help-types` | Add help request | First type used as default `type_id`. |
| GET | `/consultations` | Requests → Consult | `my_requests_only=true`. |
| POST | `/consultations` | Add consultation | JSON `consultant_type_id`, `title`, `consultation_text`. |
| GET | `/consultant-types` | Add consultation | Live type picker. |
| GET | `/consultations/{id}/replies` | Consult details | Loaded with the detail view. |
| POST | `/consultations/{id}/reply` | Consult details | JSON `{ reply_text }`. |
| GET | `/publish-requests` | Requests → News | `my_requests_only=true`. |
| POST | `/publish-requests` | Add publish news | FormData including `request_type_id` + attachment. |
| GET | `/publish-types` | Add publish news | Live type picker. |
| GET | `/discount-offers` | Requests my-offers + Market offers tab | Catalog: no `my_requests_only`. Requests tab: `my_requests_only=true`. Lists are often empty — empty state is correct. |
| GET | `/discount-offers/{id}` | Offer details | |
| POST | `/discount-offers` | Add offer | FormData; `start_date`/`end_date` from date inputs. |
| POST | `/discount-offers/{id}/redeem` | Offer claim button | |
| GET | `/discount-types` | Add offer | First type used as default. |
| GET | `/place-bookings` | Requests venue cards + Booking status | `my_requests_only=true`. |
| GET | `/place-bookings/available-dates` | Booking calendar | Busy days derived from dates **not** in the available list. |
| POST | `/place-bookings/check-availability` | Booking + new booking | Conflict modal uses live availability. |
| POST | `/place-bookings` | New booking | FormData + optional attachment. |
| POST | `/place-bookings/{id}/pay` | Booking pay modal | |
| POST | `/place-bookings/{id}/cancel` | Booking cancel | |
| GET | `/booking-types` | New booking | Live type picker (`booking_types` envelope). |
| GET | `/subscriptions` | Packages + profile packages | `active_only=true`. |
| POST | `/subscriptions/{id}/subscribe` | Packages + profile | `{ payment_method: "credit_card" }`. |
| GET | `/subscriptions/member/subscriptions` | Requests booking CTA + profile banks tab | Used to decide if a package is active. |
| GET | `/requests/counts` | Requests hub badges | Falls back to list lengths if missing. |
| GET | `/excellence-members` | Excellence | Query `type_id`, `search`, `family_branch_id`, `age_category`, `year`. |
| GET | `/excellence-types` | Excellence chips | Replaces dummy scientific/community/religious. |
| GET | `/excellence-members/{id}/commendations` | Excellence details | |
| POST | `/excellence-commendations` | Excellence praise | |
| GET | `/councils` | Members current/previous | `current_only` / `previous_only`. |
| GET | `/councils/{id}` | Previous board details | |
| GET | `/councils/{id}/members` | Members | |
| GET | `/elections` | Elections | First election treated as active. |
| GET | `/elections/{id}/candidates` | Elections vote lists | |
| GET | `/elections/{id}/candidate-counts` | Nominate-phase stats | Optional. |
| POST | `/elections/candidates` | Nominate form | FormData `election_id`, `position`, `bio`, `image`, `files[]`. |
| POST | `/elections/votes` | Vote | JSON `election_id`, `candidate_id`, `position`. |
| GET | `/products` | Market → Family Store | `search`, pagination 15/page. Live data present. |
| GET | `/products/{id}` | Product details / buy / receipt | |
| POST | `/orders` | Buy form | JSON buy payload. Redirects to EdfaPay `redirect_url` when present. **Orders list is currently empty.** |
| GET | `/books` | Achievements (library) | `category_id`, `search`, pagination. |
| GET | `/books/categories` | Library chips | Envelope `{ categories: [{ id, name_ar, name_en, active_books_count }] }` — منشورات / صور. |
| GET | `/books/{id}` | Achievement details | |
| GET | `/profile` | Profile personal tab | |
| POST | `/profile` | Profile save | FormData `name`, `gender`, `phone`, optional `image`. |
| GET | `/bank-accounts` | Profile banks | |
| POST | `/password/change` | Profile password | `old_password`, `new_password`, `confirm_password`. |
| PUT | `/settings` | Profile save | `language`, `notifications_enabled`. |
| POST | `/settings/delete-account` | Profile delete | `{ password, confirmation: "DELETE" }`. |
| GET | `/family-branches` | Add event | Public list. |

---

## Not done / out of scope

Admin / back-office Postman items with **no website button**:

- Event/news/product/book CRUD update/delete, approve/reject bookings, approve/reject publish/help/discount, order status, pending commendations
- Notification blasts (`send-to-user`, `send-to-device-type`)
- Revenues + refund
- Donations module (not on dashboard)
- App rating, contact inbox, banners as store carousel
- `GET /news-types` — **404** on this environment; news filters fall back to “All” only
- `GET /booking-slots` helper exists but the booking calendar still uses free time inputs
- Product donate flow (`order_type=donate`)
- Book download/save (`POST /books/{id}/download`, saved-books)

---

## Blocked / shape surprises

| Item | What happened |
|------|----------------|
| `GET /news-types` | 404. News list uses search + optional type chips only if the endpoint returns later. |
| `GET /event-types` | 200 but list key is `event_types`, not `data`. Handled via `apiGetRaw`. Same pattern: `booking_types`, `categories` on books. |
| `GET /discount-offers` and `GET /orders` | Empty `data: []`. UI empty state is live, not dummy. Sample MD used only to size fields. |
| `GET /help-orders/{id}` | Not in Postman. Detail page tries show-by-id then falls back to filtering the list. |
| Order create envelope | Returns `order` + `payment` (not always `data`). Client reads both. |
| Member images | Relative `storage_link/...` paths resolved against API host. |

Paste a Postman JSON here if a screen still 401s or returns an unexpected nested key.

---

## Critical UI changes that shipped

- **Event types** are live (`Family Meetings`, `Trips`, …), not hardcoded wedding/meetings.
- **Event date slider/calendar** refetch `GET /events?date=YYYY-MM-DD`.
- **1–5 star rating** on event cards/details when `can_rate_event`.
- **Remind** calls `/reminder/toggle`.
- **Add event** fields match Store Event FormData (Arabic + English name, live types/branches, gallery files).
- **Library filters** come from `GET /books/categories` (Publications / Photos), not dummy scientific/communal/religious.
- **Excellence chips** come from `GET /excellence-types`.
- **Requests hub** is five backends (help, consult, publish, my discount-offers, place-bookings); packages page uses subscriptions.
- **Pagination** load-more (15/page) on news, market, library.
- **Empty lists** (offers/orders) stay empty — no fake rows.
