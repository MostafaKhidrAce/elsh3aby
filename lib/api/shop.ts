import { apiGet, apiGetPage, apiPost, type ApiQuery } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import { extractImageUrls, pairLocalized, pairNamed, resolveMedia } from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";
import type { MarketProduct } from "@/lib/dashboard/dummy-market";

type ApiProduct = {
  id: number;
  title?: string | null;
  title_ar?: string | null;
  title_en?: string | null;
  description?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  price?: string | number | null;
  image_url?: string | null;
  image?: string | null;
  category?: string | { name?: string | null; name_ar?: string | null; name_en?: string | null } | null;
  category_label?: string | null;
  category_label_ar?: string | null;
  category_label_en?: string | null;
  gallery?: unknown;
};

export type OrderView = {
  id: number;
  quantity: number;
  totalAmount: string;
  status: string;
  paymentStatus: string;
  pdfUrl?: string | null;
  redirectUrl?: string | null;
  product?: MarketProduct;
  name?: string | null;
  phone?: string | null;
  shippingAddress?: string | null;
};

type ApiOrder = {
  id: number;
  quantity?: number;
  total_amount?: string | number | null;
  status?: string | null;
  payment_status?: string | null;
  pdf_url?: string | null;
  edfapay_redirect_url?: string | null;
  name?: string | null;
  phone?: string | null;
  shipping_address?: string | null;
  product?: ApiProduct | null;
};

const FALLBACK = "/placeholder/user-placeholder-img.svg";

export function toMarketProduct(item: ApiProduct, _locale: Locale): MarketProduct {
  const images = extractImageUrls(item.gallery ?? item.image_url ?? item.image).map((url) =>
    resolveMedia(url, FALLBACK),
  );
  const title = pairLocalized(item.title_ar, item.title_en || item.title);
  const description = pairLocalized(item.description_ar, item.description_en || item.description);
  const categorySlug = typeof item.category === "string" ? item.category : "";
  const category =
    item.category && typeof item.category === "object"
      ? pairNamed(item.category, item.category_label || categorySlug)
      : pairLocalized(
          item.category_label_ar || item.category_label,
          item.category_label_en || categorySlug,
        );
  return {
    id: String(item.id),
    title: title.ar,
    titleEn: title.en,
    shortDescription: description.ar.slice(0, 80),
    shortDescriptionEn: description.en.slice(0, 80),
    description: description.ar,
    descriptionEn: description.en,
    category: category.ar,
    categoryEn: category.en,
    price: Number(item.price ?? 0),
    images: images.length ? images : [FALLBACK],
  };
}

export async function getProducts(locale: Locale, token: string, query?: ApiQuery) {
  const page = await apiGetPage<ApiProduct[]>("/products", locale, token, {
    per_page: 15,
    ...query,
  });
  return {
    items: asList<ApiProduct>(page.data).map((item) => toMarketProduct(item, locale)),
    meta: page.meta,
  };
}

export async function getProduct(id: string | number, locale: Locale, token: string) {
  const item = await apiGet<ApiProduct>(`/products/${id}`, locale, token);
  return toMarketProduct(item, locale);
}

export async function createOrder(
  payload: {
    name: string;
    phone: string;
    product_id: number;
    order_type?: "buy" | "donate";
    quantity: number;
    shipping_address: string;
    lat?: number;
    long?: number;
    notes?: string;
  },
  locale: Locale,
  token: string,
) {
  return apiPost<{
    id?: number;
    order?: ApiOrder;
    payment?: { redirect_url?: string };
    edfapay_redirect_url?: string;
  }>("/orders", { order_type: "buy", ...payload }, locale, token);
}

export async function getOrder(id: string | number, locale: Locale, token: string): Promise<OrderView> {
  const item = await apiGet<ApiOrder>(`/orders/${id}`, locale, token);
  return {
    id: item.id,
    quantity: item.quantity ?? 1,
    totalAmount: String(item.total_amount ?? ""),
    status: item.status || "",
    paymentStatus: item.payment_status || "",
    pdfUrl: item.pdf_url,
    redirectUrl: item.edfapay_redirect_url,
    product: item.product ? toMarketProduct(item.product, locale) : undefined,
    name: item.name,
    phone: item.phone,
    shippingAddress: item.shipping_address,
  };
}

