export type NewsCategoryId = "all" | "scientific" | "community" | "religious";

export type DummyNewsComment = {
  id: string;
  author: string;
  authorEn: string;
  dateLabel: string;
  dateLabelEn: string;
  text: string;
  textEn: string;
};

export type DummyNewsItem = {
  id: string;
  category: Exclude<NewsCategoryId, "all">;
  title: string;
  titleEn: string;
  dateLabel: string;
  dateLabelEn: string;
  author: string;
  authorEn: string;
  coverImage: string;
  images: string[];
  body: string;
  bodyEn: string;
  quote?: string;
  quoteEn?: string;
  comments: DummyNewsComment[];
};

const GRAD_IMG =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80";
const CROWD_IMG =
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80";
const MEETING_IMG =
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&q=80";
const FAMILY_IMG =
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80";

const DEFAULT_COMMENTS: DummyNewsComment[] = [
  {
    id: "nc1",
    author: "راشد صالح",
    authorEn: "Rashid Saleh",
    dateLabel: "22 مايو 2025 - 04:22 مساءً",
    dateLabelEn: "22 May 2025 - 04:22 PM",
    text: "ألف مبروك للخريجين، إنجاز يشرف العائلة كلها.",
    textEn: "Congratulations to the graduates — an achievement that honors the whole family.",
  },
  {
    id: "nc2",
    author: "فيصل الشعيبي",
    authorEn: "Faisal Al-Shuaibi",
    dateLabel: "22 مايو 2025 - 05:10 مساءً",
    dateLabelEn: "22 May 2025 - 05:10 PM",
    text: "سعداء بهذا التميز، وبالتوفيق للجميع.",
    textEn: "Happy with this excellence, and best of luck to everyone.",
  },
  {
    id: "nc3",
    author: "ناصر العتيبي",
    authorEn: "Nasser Al-Otaibi",
    dateLabel: "21 مايو 2025 - 09:40 مساءً",
    dateLabelEn: "21 May 2025 - 09:40 PM",
    text: "بارك الله فيهم وفي أسرهم الكريمة.",
    textEn: "May God bless them and their noble families.",
  },
];

const BODY_AR =
  "شهدت كلية الاقتصاد والعلوم بجامعة الملك عبدالعزيز حفل تخرج دفعة 2025 بحضور عدد من أبناء وبنات العائلة. تميز الحفل بتنظيم راقٍ وكلمات ملهمة للخريجين وأسرهم، مع تكريم المتفوقين وتوثيق اللحظات الجميلة. نبارك للجميع هذا الإنجاز ونتمنى لهم مستقبلاً مشرقاً في مسيرتهم العلمية والمهنية.";

const BODY_EN =
  "The College of Economics and Sciences at King Abdulaziz University hosted the Class of 2025 graduation ceremony with many family members present. The event featured elegant organization, inspiring speeches, recognition of top students, and memorable moments. We congratulate everyone and wish them a bright future.";

const QUOTE_AR =
  "العلم يرفع بيوتاً لا عماد لها، والجهل يهدم بيوت العز والكرم.";

const QUOTE_EN =
  "Knowledge raises houses that have no pillars, and ignorance tears down houses of honor and generosity.";

function item(
  partial: Omit<DummyNewsItem, "body" | "bodyEn" | "comments" | "images"> & {
    images?: string[];
    quote?: string;
    quoteEn?: string;
  },
): DummyNewsItem {
  return {
    ...partial,
    body: BODY_AR,
    bodyEn: BODY_EN,
    comments: DEFAULT_COMMENTS,
    images: partial.images ?? [partial.coverImage, CROWD_IMG, MEETING_IMG],
    quote: partial.quote ?? QUOTE_AR,
    quoteEn: partial.quoteEn ?? QUOTE_EN,
  };
}

export const DUMMY_NEWS: DummyNewsItem[] = [
  item({
    id: "n1",
    category: "scientific",
    title: "حفل تخرج دفعة 2025 كلية الاقتصاد والعلوم جامعة الملك عبد العزيز",
    titleEn:
      "Graduation ceremony of class 2025, College of Economics and Sciences, King Abdulaziz University",
    dateLabel: "22 مايو 2025 - 10:12 م",
    dateLabelEn: "22 May 2025 - 10:12 PM",
    author: "محمد بن عبدالعزيز",
    authorEn: "Mohammed bin Abdulaziz",
    coverImage: GRAD_IMG,
  }),
  item({
    id: "n2",
    category: "community",
    title: "لقاء عائلي يجمع أبناء الشعيبي في الأحساء",
    titleEn: "Family gathering of Al-Shuaibi members in Al-Ahsa",
    dateLabel: "20 مايو 2025 - 08:30 م",
    dateLabelEn: "20 May 2025 - 08:30 PM",
    author: "صالح عبدالله سلطان",
    authorEn: "Saleh Abdullah Sultan",
    coverImage: FAMILY_IMG,
  }),
  item({
    id: "n3",
    category: "religious",
    title: "درس أسبوعي في السيرة النبوية لأفراد العائلة",
    titleEn: "Weekly Prophetic biography lesson for family members",
    dateLabel: "18 مايو 2025 - 07:00 م",
    dateLabelEn: "18 May 2025 - 07:00 PM",
    author: "فيصل الشعيبي",
    authorEn: "Faisal Al-Shuaibi",
    coverImage: MEETING_IMG,
  }),
  item({
    id: "n4",
    category: "scientific",
    title: "تكريم المتفوقين علمياً من أبناء العائلة",
    titleEn: "Honoring academically outstanding family members",
    dateLabel: "15 مايو 2025 - 06:45 م",
    dateLabelEn: "15 May 2025 - 06:45 PM",
    author: "ناصر العتيبي",
    authorEn: "Nasser Al-Otaibi",
    coverImage: CROWD_IMG,
  }),
  item({
    id: "n5",
    category: "community",
    title: "مبادرة تطوعية لدعم الأسر المحتاجة",
    titleEn: "Volunteer initiative to support families in need",
    dateLabel: "12 مايو 2025 - 05:20 م",
    dateLabelEn: "12 May 2025 - 05:20 PM",
    author: "راشد صالح",
    authorEn: "Rashid Saleh",
    coverImage: FAMILY_IMG,
  }),
  item({
    id: "n6",
    category: "religious",
    title: "أمسية قرآنية رمضانية لأفراد الأسرة",
    titleEn: "Ramadan Quran evening for family members",
    dateLabel: "10 مايو 2025 - 09:15 م",
    dateLabelEn: "10 May 2025 - 09:15 PM",
    author: "ماجد الشعيبي",
    authorEn: "Majed Al-Shuaibi",
    coverImage: MEETING_IMG,
  }),
];

export function getNewsById(id: string): DummyNewsItem | undefined {
  return DUMMY_NEWS.find((item) => item.id === id);
}
