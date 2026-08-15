export type EventCategoryId = "wedding" | "meetings";

export type DummyEvent = {
  id: string;
  category: EventCategoryId;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  location: string;
  locationEn: string;
  time: string;
  publisherName: string;
  publisherNameEn: string;
  branch?: string;
  branchEn?: string;
  dateKey: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Build a sliding window of dates centered around today. */
export function buildSliderDates(days = 21): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - Math.floor(days / 2));

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return toDateKey(date);
  });
}

function offsetDateKey(base: Date, offsetDays: number): string {
  const date = new Date(base);
  date.setDate(base.getDate() + offsetDays);
  return toDateKey(date);
}

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

const TODAY_KEY = toDateKey(TODAY);
const YESTERDAY_KEY = offsetDateKey(TODAY, -1);
const TOMORROW_KEY = offsetDateKey(TODAY, 1);
const PLUS_2 = offsetDateKey(TODAY, 2);
const PLUS_3 = offsetDateKey(TODAY, 3);

export const DUMMY_EVENTS: DummyEvent[] = [
  {
    id: "w1",
    category: "wedding",
    title: "حفل زفاف طلال بن راشد",
    titleEn: "Wedding of Talal bin Rashid",
    description:
      "نحتفل بزواج طلال بن راشد في أمسية بهيجة تجمع الأهل والأحباب على الخير والمودة.",
    descriptionEn:
      "We celebrate Talal bin Rashid's wedding in a joyful evening gathering family and loved ones.",
    location: "مدينة الرياض شارع الملك عبد العزيز",
    locationEn: "Riyadh, King Abdulaziz Street",
    time: "09:35 م",
    publisherName: "صالح عبدالله سلطان",
    publisherNameEn: "Saleh Abdullah Sultan",
    branch: "فرع صالح + ص",
    branchEn: "Saleh branch + S",
    dateKey: TODAY_KEY,
  },
  {
    id: "w2",
    category: "wedding",
    title: "حفل زفاف أحمد بن محمد",
    titleEn: "Wedding of Ahmed bin Mohammed",
    description:
      "نحتفل بزواج أحمد بن محمد في أمسية بهيجة تجمع الأهل والأحباب على الخير والمودة.",
    descriptionEn:
      "We celebrate Ahmed bin Mohammed's wedding in a joyful evening with family and loved ones.",
    location: "الأحساء - الهفوف",
    locationEn: "Al-Ahsa - Hofuf",
    time: "09:30 م",
    publisherName: "فيصل الشعيبي",
    publisherNameEn: "Faisal Al-Shuaibi",
    branch: "فرع فيصل + ف",
    branchEn: "Faisal branch + F",
    dateKey: TODAY_KEY,
  },
  {
    id: "w3",
    category: "wedding",
    title: "حفل زفاف خالد بن سعد",
    titleEn: "Wedding of Khaled bin Saad",
    description:
      "نحتفل بزواج خالد بن سعد في أمسية بهيجة تجمع الأهل والأحباب على الخير والمودة.",
    descriptionEn:
      "We celebrate Khaled bin Saad's wedding in a joyful evening with family and loved ones.",
    location: "الدمام - حي الشاطئ",
    locationEn: "Dammam - Al Shatea",
    time: "07:00 م",
    publisherName: "ناصر العتيبي",
    publisherNameEn: "Nasser Al-Otaibi",
    branch: "فرع ناصر + ن",
    branchEn: "Nasser branch + N",
    dateKey: TODAY_KEY,
  },
  {
    id: "w4",
    category: "wedding",
    title: "حفل زفاف عبدالله بن فهد",
    titleEn: "Wedding of Abdullah bin Fahad",
    description:
      "نحتفل بزواج عبدالله بن فهد في أمسية بهيجة تجمع الأهل والأحباب على الخير والمودة.",
    descriptionEn:
      "We celebrate Abdullah bin Fahad's wedding in a joyful evening with family and loved ones.",
    location: "الخبر - كورنيش الخبر",
    locationEn: "Khobar Corniche",
    time: "06:00 م",
    publisherName: "ماجد الشعيبي",
    publisherNameEn: "Majed Al-Shuaibi",
    branch: "فرع ماجد + م",
    branchEn: "Majed branch + M",
    dateKey: TODAY_KEY,
  },
  {
    id: "m1",
    category: "meetings",
    title: "اجتماع مجلس الإدارة الشهري",
    titleEn: "Monthly board meeting",
    description: "مناقشة خطط الربع القادم والمبادرات المجتمعية للعائلة.",
    descriptionEn: "Discuss next-quarter plans and family community initiatives.",
    location: "مقر العائلة - الأحساء",
    locationEn: "Family HQ - Al-Ahsa",
    time: "05:00 م",
    publisherName: "إدارة العائلة",
    publisherNameEn: "Family Admin",
    branch: "فرع الإدارة",
    branchEn: "Admin branch",
    dateKey: TODAY_KEY,
  },
  {
    id: "m2",
    category: "meetings",
    title: "لقاء تنسيقي لصندوق العائلة",
    titleEn: "Family fund coordination meeting",
    description: "متابعة بنود الميزانية واعتماد المبادرات الجديدة.",
    descriptionEn: "Budget follow-up and approval of new initiatives.",
    location: "قاعة الاجتماعات الرئيسية",
    locationEn: "Main meeting hall",
    time: "04:00 م",
    publisherName: "لجنة الصندوق",
    publisherNameEn: "Fund Committee",
    branch: "فرع الصندوق",
    branchEn: "Fund branch",
    dateKey: TODAY_KEY,
  },
  {
    id: "m3",
    category: "meetings",
    title: "ورشة تخطيط الفعاليات",
    titleEn: "Events planning workshop",
    description: "جلسة عمل لترتيب جدول فعاليات الموسم القادم.",
    descriptionEn: "A working session to arrange next season's event schedule.",
    location: "قاعة التدريب",
    locationEn: "Training hall",
    time: "11:00 ص",
    publisherName: "فريق الفعاليات",
    publisherNameEn: "Events Team",
    branch: "فرع الفعاليات",
    branchEn: "Events branch",
    dateKey: TODAY_KEY,
  },
  {
    id: "m4",
    category: "meetings",
    title: "اجتماع لجنة التميز",
    titleEn: "Excellence committee meeting",
    description: "مراجعة مرشحي التميز العائلي ومعايير التقييم.",
    descriptionEn: "Review excellence nominees and evaluation criteria.",
    location: "مكتب اللجنة",
    locationEn: "Committee office",
    time: "01:00 م",
    publisherName: "لجنة التميز",
    publisherNameEn: "Excellence Committee",
    branch: "فرع التميز",
    branchEn: "Excellence branch",
    dateKey: TODAY_KEY,
  },
  {
    id: "w5",
    category: "wedding",
    title: "حفل زفاف سعد بن علي",
    titleEn: "Wedding of Saad bin Ali",
    description: "حفل خاص لأفراد العائلة في قاعة الياسمين.",
    descriptionEn: "A private family wedding at Yasmin Hall.",
    location: "الأحساء - المبرز",
    locationEn: "Al-Ahsa - Al Mubarraz",
    time: "08:30 م",
    publisherName: "علي الشعيبي",
    publisherNameEn: "Ali Al-Shuaibi",
    branch: "فرع علي + ع",
    branchEn: "Ali branch + A",
    dateKey: TOMORROW_KEY,
  },
  {
    id: "m5",
    category: "meetings",
    title: "اجتماع الطوارئ",
    titleEn: "Emergency meeting",
    description: "اجتماع عاجل لمناقشة مستجدات مهمة.",
    descriptionEn: "An urgent meeting to discuss important updates.",
    location: "مقر العائلة",
    locationEn: "Family HQ",
    time: "10:00 ص",
    publisherName: "إدارة العائلة",
    publisherNameEn: "Family Admin",
    branch: "فرع الإدارة",
    branchEn: "Admin branch",
    dateKey: TOMORROW_KEY,
  },
  {
    id: "w6",
    category: "wedding",
    title: "حفل زفاف يوسف بن حامد",
    titleEn: "Wedding of Yousef bin Hamed",
    description: "دعوة عامة لحضور حفل الزفاف.",
    descriptionEn: "A general invitation to attend the wedding.",
    location: "الرياض - حي النرجس",
    locationEn: "Riyadh - Al Narjis",
    time: "09:00 م",
    publisherName: "حامد الشعيبي",
    publisherNameEn: "Hamed Al-Shuaibi",
    branch: "فرع حامد + ح",
    branchEn: "Hamed branch + H",
    dateKey: PLUS_2,
  },
  {
    id: "m6",
    category: "meetings",
    title: "اجتماع المتطوعين",
    titleEn: "Volunteers meeting",
    description: "تنسيق فرق العمل للمتطوعين في الفعاليات القادمة.",
    descriptionEn: "Coordinate volunteer teams for upcoming events.",
    location: "قاعة الأنشطة",
    locationEn: "Activities hall",
    time: "03:00 م",
    publisherName: "فريق التطوع",
    publisherNameEn: "Volunteers Team",
    branch: "فرع التطوع",
    branchEn: "Volunteers branch",
    dateKey: PLUS_3,
  },
  {
    id: "m7",
    category: "meetings",
    title: "مراجعة أسبوعية",
    titleEn: "Weekly review",
    description: "مراجعة سريعة لمستجدات الأسبوع الماضي.",
    descriptionEn: "A quick review of last week's updates.",
    location: "عبر الإنترنت",
    locationEn: "Online",
    time: "12:00 م",
    publisherName: "إدارة العائلة",
    publisherNameEn: "Family Admin",
    branch: "فرع الإدارة",
    branchEn: "Admin branch",
    dateKey: YESTERDAY_KEY,
  },
];

export const SLIDER_DATES = buildSliderDates(21);

export function getEventsForDate(dateKey: string): DummyEvent[] {
  return DUMMY_EVENTS.filter((event) => event.dateKey === dateKey);
}

export function getDatesWithEvents(): Set<string> {
  return new Set(DUMMY_EVENTS.map((event) => event.dateKey));
}
