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
