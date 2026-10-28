import { apiGetRaw, apiPost, apiPostForm, type ApiQuery } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import { formatDateTimeLabel } from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";
import type { BookingStatusItem } from "@/lib/dashboard/dummy-venue-bookings";
import { getPlaceBookings } from "@/lib/api/requests";

type ApiSlot = {
  id?: number;
  time_from?: string | null;
  time_to?: string | null;
  from?: string | null;
  to?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  is_available?: boolean;
  available?: boolean;
  price?: string | number | null;
  booking_price?: string | number | null;
  amount?: string | number | null;
};

export type BookingSlotView = {
  id: string;
  from: string;
  to: string;
  available: boolean;
  price: number | null;
};

export function parseBookingPrice(value: unknown): number | null {
  if (value == null || value === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function slotTime(value?: string | null): string {
  const raw = (value || "").trim();
  return raw.length >= 5 ? raw.slice(0, 5) : raw;
}

export async function getBookingSlots(
  locale: Locale,
  token: string,
  query: { booking_type_id?: number | string; date?: string },
) {
  try {
    const json = await apiGetRaw<Record<string, unknown>>(
      "/booking-slots",
      locale,
      token,
      query,
    );
    return asList<ApiSlot>(json.data ?? json).map((slot, index) => ({
      id: String(slot.id ?? index),
      from: slotTime(slot.time_from || slot.from || slot.start_time),
      to: slotTime(slot.time_to || slot.to || slot.end_time),
      available: slot.is_available ?? slot.available ?? true,
      price: parseBookingPrice(slot.price ?? slot.booking_price ?? slot.amount),
    })) satisfies BookingSlotView[];
  } catch {
    return [];
  }
}

export async function getAvailableBookingDates(
  locale: Locale,
  token: string,
  query?: ApiQuery,
): Promise<string[] | null> {
  try {
    const json = await apiGetRaw<Record<string, unknown>>(
      "/place-bookings/available-dates",
      locale,
      token,
      query,
    );
    return asList<string | { date?: string }>(json.data ?? json)
      .map((item) => (typeof item === "string" ? item : item.date || ""))
      .filter(Boolean)
      .map((value) => value.slice(0, 10));
  } catch {
    return null;
  }
}

export async function checkBookingAvailability(
  date: string,
  locale: Locale,
  token: string,
  extra?: { booking_type_id?: number | string },
) {
  try {
    const data = await apiPost<{ available?: boolean; is_available?: boolean }>(
      "/place-bookings/check-availability",
      {
        date,
        ...(extra?.booking_type_id ? { booking_type_id: Number(extra.booking_type_id) } : {}),
      },
      locale,
      token,
    );
    return data.available ?? data.is_available ?? true;
  } catch {
    return true;
  }
}

export async function createPlaceBooking(
  payload: {
    booking_type_id: number;
    full_name: string;
    phone: string;
    date_from: string;
    date_to: string;
    time_from: string;
    time_to: string;
    booking_slot_id?: number;
    attendees_count?: number;
    additional_notes?: string;
    attachment?: File | null;
  },
  locale: Locale,
  token: string,
) {
  const body = new FormData();
  body.append("booking_type_id", String(payload.booking_type_id));
  body.append("full_name", payload.full_name);
  body.append("phone", payload.phone);
  body.append("date_from", payload.date_from);
  body.append("date_to", payload.date_to);
  body.append("time_from", payload.time_from);
  body.append("time_to", payload.time_to);
  if (payload.booking_slot_id) {
    body.append("booking_slot_id", String(payload.booking_slot_id));
  }
  if (payload.attendees_count) {
    body.append("attendees_count", String(payload.attendees_count));
  }
  if (payload.additional_notes) body.append("additional_notes", payload.additional_notes);
  if (payload.attachment) body.append("attachment", payload.attachment);
  return apiPostForm("/place-bookings", body, locale, token);
}

export async function payPlaceBooking(
  id: string | number,
  locale: Locale,
  token: string,
) {
  return apiPost(`/place-bookings/${id}/pay`, {}, locale, token);
}

export async function cancelPlaceBooking(
  id: string | number,
  locale: Locale,
  token: string,
) {
  return apiPost(`/place-bookings/${id}/cancel`, {}, locale, token);
}

export async function getBookingStatusItems(
  locale: Locale,
  token: string,
): Promise<BookingStatusItem[]> {
  const bookings = await getPlaceBookings(locale, token, { my_requests_only: true });
  return bookings.map((item) => ({
    id: item.id,
    status: item.status === "approved" ? "approved" : "pending",
    canCancel: Boolean(item.canCancel),
    dateKey: item.dateKey || "",
    title: item.title,
    titleEn: item.titleEn,
    description: item.description,
    descriptionEn: item.descriptionEn,
    dateLabel: item.dateLabel,
    dateLabelEn: item.dateLabelEn,
    time: item.time,
    timeEn: item.timeEn,
    bookedBy: item.bookedBy,
    bookedByEn: item.bookedByEn,
    branch: item.branch,
    branchEn: item.branchEn,
    price: item.price ?? null,
  }));
}

export function bookingDateLabel(dateKey: string, locale: Locale) {
  return formatDateTimeLabel(dateKey, locale);
}
