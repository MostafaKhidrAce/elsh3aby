export type ExcellenceCategoryId =
  | "all"
  | "community"
  | "scientific"
  | "religious";

export type ExcellencePraise = {
  id: string;
  author: string;
  authorEn: string;
  text: string;
  textEn: string;
};

export type DummyExcellence = {
  id: string;
  category: Exclude<ExcellenceCategoryId, "all">;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  year: string;
  bio: string;
  bioEn: string;
  image: string;
  branch: string;
  branchEn: string;
  ageGroup: "youths" | "adults" | "seniors";
  praises: ExcellencePraise[];
};

const PORTRAIT_1 =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80";
const PORTRAIT_2 =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80";
const PORTRAIT_3 =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80";
const PORTRAIT_4 =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80";
const PORTRAIT_5 =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80";
const PORTRAIT_6 =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80";

const BIO_AR =
  "يتمتع بخبرة واسعة في العمل الخيري والإداري داخل الأسرة، ويؤمن بقيم التعاون والشفافية. مهتم بتطوير اللائحة الداخلية للصندوق بما يحقق العدالة والوضوح في توزيع الدعم.";
const BIO_EN =
  "He has extensive experience in charitable and administrative work within the family, and believes in cooperation and transparency. He is interested in developing the fund's internal regulations to achieve fairness and clarity in support distribution.";

const PRAISE_TEXT_AR =
  "نشكرك على جهودك المتميزة وخدمتك المستمرة للأسرة، ونتمنى لك دوام التوفيق والنجاح.";
const PRAISE_TEXT_EN =
  "Thank you for your distinguished efforts and continuous service to the family. We wish you continued success.";

export const DUMMY_EXCELLENCE: DummyExcellence[] = [
  {
    id: "ex1",
    category: "community",
    name: "نايف بن عبد العزيز الصالح",
    nameEn: "Nayef bin Abdulaziz Al Saleh",
    title: "عقيد في القوات الأمنية",
    titleEn: "Colonel in the security forces",
    year: "2025",
    bio: BIO_AR,
    bioEn: BIO_EN,
    image: PORTRAIT_1,
    branch: "Al Saleh",
    branchEn: "Al Saleh",
    ageGroup: "adults",
    praises: [
      {
        id: "p1",
        author: "نايف بن عبد العزيز الصالح",
        authorEn: "Nayef bin Abdulaziz Al Saleh",
        text: PRAISE_TEXT_AR,
        textEn: PRAISE_TEXT_EN,
      },
      {
        id: "p2",
        author: "طاهر عبدالله الصالح",
        authorEn: "Taher Abdullah Al Saleh",
        text: PRAISE_TEXT_AR,
        textEn: PRAISE_TEXT_EN,
      },
    ],
  },
  {
    id: "ex2",
    category: "scientific",
    name: "إبراهيم بن سليمان آل صالح",
    nameEn: "Ibrahim bin Sulaiman Al Saleh",
    title: "دكتوراه في الطاقة النووية",
    titleEn: "PhD in nuclear energy",
    year: "2024",
    bio: BIO_AR,
    bioEn: BIO_EN,
    image: PORTRAIT_2,
    branch: "Al Saleh",
    branchEn: "Al Saleh",
    ageGroup: "adults",
    praises: [],
  },
  {
    id: "ex3",
    category: "religious",
    name: "عبدالله بن فهد الشعيبي",
    nameEn: "Abdullah bin Fahd Al-Shuaibi",
    title: "حافظ لكتاب الله",
    titleEn: "Hafiz of the Holy Quran",
    year: "2025",
    bio: BIO_AR,
    bioEn: BIO_EN,
    image: PORTRAIT_3,
    branch: "Al-Shuaibi",
    branchEn: "Al-Shuaibi",
    ageGroup: "youths",
    praises: [
      {
        id: "p3",
        author: "صالح عبدالله",
        authorEn: "Saleh Abdullah",
        text: PRAISE_TEXT_AR,
        textEn: PRAISE_TEXT_EN,
      },
    ],
  },
  {
    id: "ex4",
    category: "community",
    name: "فيصل بن محمد الصالح",
    nameEn: "Faisal bin Mohammed Al Saleh",
    title: "مقدم في قوى الأمن",
    titleEn: "Major in the security forces",
    year: "2025",
    bio: BIO_AR,
    bioEn: BIO_EN,
    image: PORTRAIT_4,
    branch: "Al Saleh",
    branchEn: "Al Saleh",
    ageGroup: "adults",
    praises: [],
  },
  {
    id: "ex5",
    category: "scientific",
    name: "خالد بن سعد آل صالح",
    nameEn: "Khalid bin Saad Al Saleh",
    title: "باحث في الذكاء الاصطناعي",
    titleEn: "AI researcher",
    year: "2026",
    bio: BIO_AR,
    bioEn: BIO_EN,
    image: PORTRAIT_5,
    branch: "Al Saleh",
    branchEn: "Al Saleh",
    ageGroup: "youths",
    praises: [],
  },
  {
    id: "ex6",
    category: "community",
    name: "راشد بن علي الشعيبي",
    nameEn: "Rashid bin Ali Al-Shuaibi",
    title: "رائد في العمل التطوعي",
    titleEn: "Pioneer in volunteer work",
    year: "2023",
    bio: BIO_AR,
    bioEn: BIO_EN,
    image: PORTRAIT_6,
    branch: "Al-Shuaibi",
    branchEn: "Al-Shuaibi",
    ageGroup: "seniors",
    praises: [
      {
        id: "p4",
        author: "محمد بن عبدالعزيز",
        authorEn: "Mohammed bin Abdulaziz",
        text: PRAISE_TEXT_AR,
        textEn: PRAISE_TEXT_EN,
      },
    ],
  },
];

export function getExcellenceById(id: string): DummyExcellence | undefined {
  return DUMMY_EXCELLENCE.find((item) => item.id === id);
}

export const EXCELLENCE_BRANCHES = ["Al Saleh", "Al-Shuaibi"] as const;
export const EXCELLENCE_AGE_GROUPS = ["youths", "adults", "seniors"] as const;
export const EXCELLENCE_YEARS = ["2026", "2025", "2024", "2023"] as const;
