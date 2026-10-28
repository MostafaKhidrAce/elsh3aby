export type DummyVenueBooking = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  dateLabel: string;
  dateLabelEn: string;
  time: string;
  timeEn: string;
  image: string;
  hallLabel: string;
  hallLabelEn: string;
  bookedBy: string;
  bookedByEn: string;
  branch: string;
  branchEn: string;
  /** Optional fields used by /dashboard/booking status UI */
  status?: "pending" | "approved";
  canCancel?: boolean;
  dateKey?: string;
  price?: number | null;
};

export type BookingStatusItem = {
  id: string;
  status: "pending" | "approved";
  canCancel: boolean;
  dateKey: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  dateLabel: string;
  dateLabelEn: string;
  time: string;
  timeEn: string;
  bookedBy: string;
  bookedByEn: string;
  branch: string;
  branchEn: string;
  price?: number | null;
};

const HALL_IMG =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80";
const HALL_IMG_2 =
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80";
const HALL_IMG_3 =
  "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80";

const DESC_AR =
  "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى.";
const DESC_EN =
  "This is sample placeholder text that can be replaced in the same space for the booking description.";

export const BOOKING_PRICE = 300;

/** Days shown with outline markers on the booking calendar (demo). */
export const BOOKING_BUSY_DATE_KEYS = new Set([
  "2026-01-06",
  "2026-01-13",
]);

/** Selecting / submitting these dates shows the conflict modal (demo). */
export const BOOKING_CONFLICT_DATE_KEYS = new Set(["2026-01-06"]);

export const DUMMY_VENUE_BOOKINGS: DummyVenueBooking[] = [
  {
    id: "vb1",
    title: "حجز قاعة المؤتمرات",
    titleEn: "Conference hall booking",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "19 أغسطس 2025",
    dateLabelEn: "19 August 2025",
    time: "00:05 مساءً",
    timeEn: "12:05 PM",
    image: HALL_IMG,
    hallLabel: "الملتقى",
    hallLabelEn: "Al-Multaqa",
    bookedBy: "صالح عبدالله سلطان",
    bookedByEn: "Saleh Abdullah Sultan",
    branch: "الأحساء",
    branchEn: "Al-Ahsa",
  },
  {
    id: "vb2",
    title: "حجز قاعة المؤتمرات",
    titleEn: "Conference hall booking",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "20 أغسطس 2025",
    dateLabelEn: "20 August 2025",
    time: "04:00 مساءً",
    timeEn: "4:00 PM",
    image: HALL_IMG_2,
    hallLabel: "الملتقى",
    hallLabelEn: "Al-Multaqa",
    bookedBy: "صالح عبدالله سلطان",
    bookedByEn: "Saleh Abdullah Sultan",
    branch: "الرياض",
    branchEn: "Riyadh",
  },
  {
    id: "vb3",
    title: "حجز قاعة الاجتماعات",
    titleEn: "Meeting hall booking",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "21 أغسطس 2025",
    dateLabelEn: "21 August 2025",
    time: "06:30 مساءً",
    timeEn: "6:30 PM",
    image: HALL_IMG_3,
    hallLabel: "الملتقى",
    hallLabelEn: "Al-Multaqa",
    bookedBy: "فيصل الشعيبي",
    bookedByEn: "Faisal Al-Shuaibi",
    branch: "الأحساء",
    branchEn: "Al-Ahsa",
  },
  {
    id: "vb4",
    title: "حجز قاعة المؤتمرات",
    titleEn: "Conference hall booking",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "22 أغسطس 2025",
    dateLabelEn: "22 August 2025",
    time: "01:00 مساءً",
    timeEn: "1:00 PM",
    image: HALL_IMG,
    hallLabel: "الملتقى",
    hallLabelEn: "Al-Multaqa",
    bookedBy: "صالح عبدالله سلطان",
    bookedByEn: "Saleh Abdullah Sultan",
    branch: "جدة",
    branchEn: "Jeddah",
  },
  {
    id: "vb5",
    title: "حجز قاعة المناسبات",
    titleEn: "Events hall booking",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "23 أغسطس 2025",
    dateLabelEn: "23 August 2025",
    time: "08:00 مساءً",
    timeEn: "8:00 PM",
    image: HALL_IMG_2,
    hallLabel: "الملتقى",
    hallLabelEn: "Al-Multaqa",
    bookedBy: "سارة محمد",
    bookedByEn: "Sarah Mohammed",
    branch: "الأحساء",
    branchEn: "Al-Ahsa",
  },
  {
    id: "vb6",
    title: "حجز قاعة المؤتمرات",
    titleEn: "Conference hall booking",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "24 أغسطس 2025",
    dateLabelEn: "24 August 2025",
    time: "11:00 صباحاً",
    timeEn: "11:00 AM",
    image: HALL_IMG_3,
    hallLabel: "الملتقى",
    hallLabelEn: "Al-Multaqa",
    bookedBy: "صالح عبدالله سلطان",
    bookedByEn: "Saleh Abdullah Sultan",
    branch: "الدمام",
    branchEn: "Dammam",
  },
  {
    id: "vb7",
    title: "حجز قاعة التدريب",
    titleEn: "Training hall booking",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "25 أغسطس 2025",
    dateLabelEn: "25 August 2025",
    time: "03:00 مساءً",
    timeEn: "3:00 PM",
    image: HALL_IMG,
    hallLabel: "الملتقى",
    hallLabelEn: "Al-Multaqa",
    bookedBy: "عبدالله فهد",
    bookedByEn: "Abdullah Fahd",
    branch: "الأحساء",
    branchEn: "Al-Ahsa",
  },
];

const WEDDING_DESC_AR =
  "سيتم إقامة حفل زواج أحد أبناء العائلة في مقر العائلة بمدينة الرياض";
const WEDDING_DESC_EN =
  "A wedding for one of the family members will be held at the family headquarters in Riyadh.";

/** Status list shown on /dashboard/booking */
export const DUMMY_BOOKING_STATUS_ITEMS: BookingStatusItem[] = [
  {
    id: "bs1",
    status: "pending",
    canCancel: true,
    dateKey: "2025-07-17",
    title: "حفل زواج أحد أبناء العائلة",
    titleEn: "Wedding of a family member",
    description: WEDDING_DESC_AR,
    descriptionEn: WEDDING_DESC_EN,
    dateLabel: "17 يوليو 2025",
    dateLabelEn: "17 July 2025",
    time: "2 م إلى 5 م",
    timeEn: "2 PM to 5 PM",
    bookedBy: "صالح عبدالله سلطان",
    bookedByEn: "Saleh Abdullah Sultan",
    branch: "فرع آل صالح - حي النخيل",
    branchEn: "Al-Saleh branch - Al-Nakheel",
  },
  {
    id: "bs2",
    status: "approved",
    canCancel: true,
    dateKey: "2025-07-17",
    title: "حفل زفاف طلال بن راشد",
    titleEn: "Talal bin Rashid's wedding",
    description: WEDDING_DESC_AR,
    descriptionEn: WEDDING_DESC_EN,
    dateLabel: "17 يوليو 2025",
    dateLabelEn: "17 July 2025",
    time: "2 م إلى 5 م",
    timeEn: "2 PM to 5 PM",
    bookedBy: "صالح عبدالله سلطان",
    bookedByEn: "Saleh Abdullah Sultan",
    branch: "فرع آل صالح - حي النخيل",
    branchEn: "Al-Saleh branch - Al-Nakheel",
  },
  {
    id: "bs3",
    status: "pending",
    canCancel: false,
    dateKey: "2025-08-01",
    title: "لقاء عائلي شهري",
    titleEn: "Monthly family gathering",
    description: WEDDING_DESC_AR,
    descriptionEn: WEDDING_DESC_EN,
    dateLabel: "1 أغسطس 2025",
    dateLabelEn: "1 August 2025",
    time: "4 م إلى 8 م",
    timeEn: "4 PM to 8 PM",
    bookedBy: "فيصل الشعيبي",
    bookedByEn: "Faisal Al-Shuaibi",
    branch: "فرع الرياض",
    branchEn: "Riyadh branch",
  },
];

const PACKAGE_KEY = "elsh3aby-has-active-package";

export function hasActivePackage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(PACKAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setActivePackage(active: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (active) window.localStorage.setItem(PACKAGE_KEY, "1");
    else window.localStorage.removeItem(PACKAGE_KEY);
  } catch {
    // ignore
  }
}

export type SubscriptionPackage = {
  id: string;
  durationAr: string;
  durationEn: string;
  price: number;
};

export const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  { id: "1m", durationAr: "١ شهر", durationEn: "1 month", price: 100 },
  { id: "3m", durationAr: "٣ أشهر", durationEn: "3 months", price: 300 },
  { id: "1y", durationAr: "سنة", durationEn: "1 year", price: 900 },
  { id: "6m", durationAr: "٦ أشهر", durationEn: "6 months", price: 500 },
];
