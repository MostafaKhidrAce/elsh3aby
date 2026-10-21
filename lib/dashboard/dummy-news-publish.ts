export type NewsPublishTypeId = "wedding" | "meetings";

export type NewsPublishStatus = "review" | "accepted" | "rejected";

export type DummyNewsPublishRequest = {
  id: string;
  type: NewsPublishTypeId;
  typeId?: number;
  typeName?: string;
  typeNameEn?: string;
  status: NewsPublishStatus;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  location: string;
  locationEn: string;
  time: string;
  timeEn: string;
};

export const NEWS_PUBLISH_TYPES: NewsPublishTypeId[] = ["wedding", "meetings"];

const SAMPLE_DESC_AR =
  "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.";
const SAMPLE_DESC_EN =
  "This is sample placeholder text that can be replaced in the same space. It demonstrates how a news description appears on the card.";

export const DUMMY_NEWS_PUBLISH_REQUESTS: DummyNewsPublishRequest[] = [
  {
    id: "np-w1",
    type: "wedding",
    status: "review",
    title: "حفل زفاف طلال بن راشد",
    titleEn: "Wedding of Talal bin Rashid",
    description: SAMPLE_DESC_AR,
    descriptionEn: SAMPLE_DESC_EN,
    location: "مدينة الرياض شارع الملك عبد العزيز",
    locationEn: "Riyadh, King Abdulaziz Street",
    time: "3:00 مساءاً",
    timeEn: "3:00 PM",
  },
  {
    id: "np-w2",
    type: "wedding",
    status: "accepted",
    title: "حفل زفاف طلال بن راشد",
    titleEn: "Wedding of Talal bin Rashid",
    description: SAMPLE_DESC_AR,
    descriptionEn: SAMPLE_DESC_EN,
    location: "مدينة الرياض شارع الملك عبد العزيز",
    locationEn: "Riyadh, King Abdulaziz Street",
    time: "3:00 مساءاً",
    timeEn: "3:00 PM",
  },
  {
    id: "np-w3",
    type: "wedding",
    status: "rejected",
    title: "حفل زفاف طلال بن راشد",
    titleEn: "Wedding of Talal bin Rashid",
    description: SAMPLE_DESC_AR,
    descriptionEn: SAMPLE_DESC_EN,
    location: "مدينة الرياض شارع الملك عبد العزيز",
    locationEn: "Riyadh, King Abdulaziz Street",
    time: "3:00 مساءاً",
    timeEn: "3:00 PM",
  },
  {
    id: "np-w4",
    type: "wedding",
    status: "review",
    title: "حفل زفاف أحمد بن محمد",
    titleEn: "Wedding of Ahmed bin Mohammed",
    description: SAMPLE_DESC_AR,
    descriptionEn: SAMPLE_DESC_EN,
    location: "جدة - حي الزهراء",
    locationEn: "Jeddah - Al Zahra",
    time: "5:00 مساءاً",
    timeEn: "5:00 PM",
  },
  {
    id: "np-m1",
    type: "meetings",
    status: "review",
    title: "لقاء عائلي شهري",
    titleEn: "Monthly family meeting",
    description: SAMPLE_DESC_AR,
    descriptionEn: SAMPLE_DESC_EN,
    location: "مقر العائلة - الأحساء",
    locationEn: "Family headquarters - Al-Ahsa",
    time: "7:00 مساءاً",
    timeEn: "7:00 PM",
  },
  {
    id: "np-m2",
    type: "meetings",
    status: "accepted",
    title: "لقاء تعارف الشباب",
    titleEn: "Youth networking meeting",
    description: SAMPLE_DESC_AR,
    descriptionEn: SAMPLE_DESC_EN,
    location: "مدينة الرياض شارع الملك عبد العزيز",
    locationEn: "Riyadh, King Abdulaziz Street",
    time: "4:30 مساءاً",
    timeEn: "4:30 PM",
  },
  {
    id: "np-m3",
    type: "meetings",
    status: "rejected",
    title: "لقاء لجنة الصندوق",
    titleEn: "Fund committee meeting",
    description: SAMPLE_DESC_AR,
    descriptionEn: SAMPLE_DESC_EN,
    location: "الدمام - الكورنيش",
    locationEn: "Dammam Corniche",
    time: "6:00 مساءاً",
    timeEn: "6:00 PM",
  },
  {
    id: "np-m4",
    type: "meetings",
    status: "accepted",
    title: "لقاء أمهات العائلة",
    titleEn: "Family mothers meeting",
    description: SAMPLE_DESC_AR,
    descriptionEn: SAMPLE_DESC_EN,
    location: "الخبر - الراكة",
    locationEn: "Khobar - Al Rakah",
    time: "11:00 صباحاً",
    timeEn: "11:00 AM",
  },
];

export function groupNewsPublishByType(
  items: DummyNewsPublishRequest[],
): Record<NewsPublishTypeId, DummyNewsPublishRequest[]> {
  return {
    wedding: items.filter((i) => i.type === "wedding"),
    meetings: items.filter((i) => i.type === "meetings"),
  };
}
