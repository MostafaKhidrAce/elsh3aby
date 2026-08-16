export type AchievementCategoryId =
  | "all"
  | "scientific"
  | "communal"
  | "religious";

export type AchievementBadgeTone = "gold" | "green" | "blue";

export type DummyAchievement = {
  id: string;
  category: Exclude<AchievementCategoryId, "all">;
  badge: string;
  badgeEn: string;
  badgeTone: AchievementBadgeTone;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  dateLabel: string;
  dateLabelEn: string;
  author: string;
  authorEn: string;
  branch: string;
  branchEn: string;
  images: string[];
};

const BOOK_1 =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&q=80";
const BOOK_2 =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=1200&q=80";
const ART_1 =
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80";
const ART_2 =
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80";
const PHOTO_1 =
  "https://images.unsplash.com/photo-1499781350541-7783f73bbb11?w=1200&q=80";
const PHOTO_2 =
  "https://images.unsplash.com/photo-1456513080800-7d93a97e8f63?w=1200&q=80";

const DESC_AR =
  "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.";
const DESC_EN =
  "This is sample placeholder text describing a family achievement publication. It can be replaced with the real achievement summary and supporting details.";

export const DUMMY_ACHIEVEMENTS: DummyAchievement[] = [
  {
    id: "ach1",
    category: "religious",
    badge: "ديني",
    badgeEn: "Religious",
    badgeTone: "gold",
    title: "رواية أدبية بعنوان البيت",
    titleEn: 'A literary novel titled "The House"',
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "22 مايو 2025 - 10:12 مساءً",
    dateLabelEn: "22 May 2025 - 10:12 PM",
    author: "صالح عبدالله سلطان",
    authorEn: "Saleh Abdullah Sultan",
    branch: "فرع آل صالح",
    branchEn: "Al-Saleh branch",
    images: [BOOK_1, BOOK_2, PHOTO_1],
  },
  {
    id: "ach2",
    category: "scientific",
    badge: "أدبي",
    badgeEn: "Literature",
    badgeTone: "green",
    title: "رواية أدبية بعنوان كن كل شيء لنفسك",
    titleEn: 'A literary novel titled "Be everything to yourself"',
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "22 مايو 2025 - 10:12 مساءً",
    dateLabelEn: "22 May 2025 - 10:12 PM",
    author: "صالح عبدالله سلطان",
    authorEn: "Saleh Abdullah Sultan",
    branch: "فرع آل صالح",
    branchEn: "Al-Saleh branch",
    images: [BOOK_2, BOOK_1, ART_1],
  },
  {
    id: "ach3",
    category: "communal",
    badge: "طائفي",
    badgeEn: "Communal",
    badgeTone: "blue",
    title: "مقال مجتمعي عن قيم التعاون الأسري",
    titleEn: "A community article on family cooperation values",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "21 مايو 2025 - 09:00 مساءً",
    dateLabelEn: "21 May 2025 - 09:00 PM",
    author: "فيصل الشعيبي",
    authorEn: "Faisal Al-Shuaibi",
    branch: "فرع الرياض",
    branchEn: "Riyadh branch",
    images: [ART_1, ART_2, PHOTO_1],
  },
  {
    id: "ach4",
    category: "scientific",
    badge: "علمي",
    badgeEn: "Scientific",
    badgeTone: "green",
    title: "بحث علمي في التراث المحلي",
    titleEn: "A scientific study on local heritage",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "20 مايو 2025 - 08:30 مساءً",
    dateLabelEn: "20 May 2025 - 08:30 PM",
    author: "سارة محمد",
    authorEn: "Sarah Mohammed",
    branch: "فرع الأحساء",
    branchEn: "Al-Ahsa branch",
    images: [PHOTO_2, BOOK_1, ART_2],
  },
  {
    id: "ach5",
    category: "religious",
    badge: "ديني",
    badgeEn: "Religious",
    badgeTone: "gold",
    title: "إصدار ديني بعنوان البيت",
    titleEn: 'A religious publication titled "The House"',
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "19 مايو 2025 - 07:15 مساءً",
    dateLabelEn: "19 May 2025 - 07:15 PM",
    author: "صالح عبدالله سلطان",
    authorEn: "Saleh Abdullah Sultan",
    branch: "فرع آل صالح",
    branchEn: "Al-Saleh branch",
    images: [PHOTO_1, BOOK_2, ART_1],
  },
  {
    id: "ach6",
    category: "communal",
    badge: "كتابات مجتمعية",
    badgeEn: "Community writings",
    badgeTone: "gold",
    title: "رواية أدبية بعنوان البيت",
    titleEn: 'A literary novel titled "The House"',
    description: DESC_AR,
    descriptionEn: DESC_EN,
    dateLabel: "18 مايو 2025 - 06:00 مساءً",
    dateLabelEn: "18 May 2025 - 06:00 PM",
    author: "صالح عبدالله سلطان",
    authorEn: "Saleh Abdullah Sultan",
    branch: "فرع آل صالح",
    branchEn: "Al-Saleh branch",
    images: [ART_2, BOOK_1, PHOTO_2],
  },
];

export function getAchievementById(id: string): DummyAchievement | undefined {
  return DUMMY_ACHIEVEMENTS.find((item) => item.id === id);
}
