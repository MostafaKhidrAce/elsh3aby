export type DummyOffer = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  dateLabel: string;
  dateLabelEn: string;
  validityLabel: string;
  validityLabelEn: string;
  location: string;
  locationEn: string;
  image: string;
  couponCode: string;
};

const STORE_IMG =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80";
const CAFE_IMG =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80";
const REST_IMG =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80";
const KIDS_IMG =
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80";
const BOOK_IMG =
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80";
const GYM_IMG =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80";

export const DUMMY_OFFERS: DummyOffer[] = [
  {
    id: "off1",
    title: "خصم 15% لدى مكتبة جرير",
    titleEn: "15% discount at Jarir Bookstore",
    description:
      "عرض خاص لأفراد العائلة على جميع الأدوات المدرسية والقرطاسية، ولا يشمل الأجهزة الإلكترونية.",
    descriptionEn:
      "Special discount for family members on all school supplies and stationery, excluding electronics.",
    dateLabel: "22 مايو 2025 - 10:12 مساءً",
    dateLabelEn: "22 May 2025 - 10:12 PM",
    validityLabel: "01 سبتمبر 2025 - 30 سبتمبر 2025",
    validityLabelEn: "01 September 2025 - 30 September 2025",
    location: "جميع فروع المملكة",
    locationEn: "All branches in the Kingdom",
    image: BOOK_IMG,
    couponCode: "XY345",
  },
  {
    id: "off2",
    title: "خصم 20% في مطعم النخبة",
    titleEn: "20% discount at Elite Restaurant",
    description:
      "خصم لجميع أفراد العائلة في مطعمنا الموجود في جدة على قائمة الطعام الرئيسية.",
    descriptionEn:
      "Discount for all family members at our Jeddah restaurant on the main menu.",
    dateLabel: "21 مايو 2025 - 09:00 مساءً",
    dateLabelEn: "21 May 2025 - 09:00 PM",
    validityLabel: "01 أغسطس 2025 - 31 أغسطس 2025",
    validityLabelEn: "01 August 2025 - 31 August 2025",
    location: "جدة - حي الزهراء",
    locationEn: "Jeddah - Al Zahra",
    image: REST_IMG,
    couponCode: "ELITE20",
  },
  {
    id: "off3",
    title: "دخول مجاني لطفل في مدينة الألعاب",
    titleEn: "Free child entry at the play city",
    description:
      "احصل على تذكرة مجانية لطفل مع كل تذكرة بالغ في عطلة نهاية الأسبوع.",
    descriptionEn:
      "Get a free child ticket with every adult ticket on weekends.",
    dateLabel: "20 مايو 2025 - 08:30 مساءً",
    dateLabelEn: "20 May 2025 - 08:30 PM",
    validityLabel: "10 يونيو 2025 - 10 يوليو 2025",
    validityLabelEn: "10 June 2025 - 10 July 2025",
    location: "الرياض - المخرج 15",
    locationEn: "Riyadh - Exit 15",
    image: KIDS_IMG,
    couponCode: "KIDS1FREE",
  },
  {
    id: "off4",
    title: "خصم 10% في المقهى الذهبي",
    titleEn: "10% discount at Golden Cafe",
    description:
      "خصم خاص على المشروبات والحلويات لأعضاء العائلة خلال أيام الأسبوع.",
    descriptionEn:
      "Special discount on drinks and desserts for family members on weekdays.",
    dateLabel: "19 مايو 2025 - 07:15 مساءً",
    dateLabelEn: "19 May 2025 - 07:15 PM",
    validityLabel: "01 يوليو 2025 - 31 يوليو 2025",
    validityLabelEn: "01 July 2025 - 31 July 2025",
    location: "الدمام - الكورنيش",
    locationEn: "Dammam Corniche",
    image: CAFE_IMG,
    couponCode: "GOLD10",
  },
  {
    id: "off5",
    title: "خصم عضوية نادي رياضي",
    titleEn: "Gym membership discount",
    description:
      "وفر على الاشتراك الشهري في النادي الرياضي مع باقة خاصة للعائلة.",
    descriptionEn:
      "Save on monthly gym membership with a special family package.",
    dateLabel: "18 مايو 2025 - 06:00 مساءً",
    dateLabelEn: "18 May 2025 - 06:00 PM",
    validityLabel: "15 أغسطس 2025 - 15 سبتمبر 2025",
    validityLabelEn: "15 August 2025 - 15 September 2025",
    location: "الخبر - الراكة",
    locationEn: "Khobar - Al Rakah",
    image: GYM_IMG,
    couponCode: "FIT25",
  },
  {
    id: "off6",
    title: "خصم 12% على الأثاث المنزلي",
    titleEn: "12% discount on home furniture",
    description:
      "عرض محدود على مختارات الأثاث المنزلي في جميع فروع المعرض.",
    descriptionEn:
      "Limited offer on selected home furniture in all showroom branches.",
    dateLabel: "17 مايو 2025 - 05:40 مساءً",
    dateLabelEn: "17 May 2025 - 05:40 PM",
    validityLabel: "01 أكتوبر 2025 - 31 أكتوبر 2025",
    validityLabelEn: "01 October 2025 - 31 October 2025",
    location: "جميع فروع المملكة",
    locationEn: "All branches in the Kingdom",
    image: STORE_IMG,
    couponCode: "HOME12",
  },
];

export function getOfferById(id: string): DummyOffer | undefined {
  return DUMMY_OFFERS.find((offer) => offer.id === id);
}

const CLAIMED_KEY = "elsh3aby-claimed-offers";

export function getClaimedOfferIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(CLAIMED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

export function claimOffer(id: string) {
  if (typeof window === "undefined") return;
  const next = getClaimedOfferIds();
  next.add(id);
  window.localStorage.setItem(CLAIMED_KEY, JSON.stringify([...next]));
}
