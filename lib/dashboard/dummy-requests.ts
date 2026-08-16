export type RequestCategory =
  | "help"
  | "consult"
  | "offers"
  | "news"
  | "booking";

export type RequestStatus = "pending" | "approved" | "rejected";

export type RequestAttachment = {
  id: string;
  name: string;
  nameEn: string;
  kind: "pdf" | "image";
};

export type ConsultReply = {
  id: string;
  author: string;
  authorEn: string;
  dateLabel: string;
  dateLabelEn: string;
  text: string;
  textEn: string;
  attachments?: RequestAttachment[];
};

export type DummyRequest = {
  id: string;
  category: RequestCategory;
  status: RequestStatus;
  title: string;
  titleEn: string;
  dateLabel: string;
  dateLabelEn: string;
  description?: string;
  descriptionEn?: string;
  typeLabel?: string;
  typeLabelEn?: string;
  requestCode?: string;
  nationalId?: string;
  consultType?: string;
  consultTypeEn?: string;
  response?: string;
  responseEn?: string;
  replies?: ConsultReply[];
  rejectionReason?: string;
  rejectionReasonEn?: string;
  attachments?: RequestAttachment[];
};

const REJECTION_AR =
  "هناك نقص في بعض المرفقات، يرجى مراجعة وإرفاق الملفات غير المكتملة.";
const REJECTION_EN =
  "There is a deficiency in some attachments; please review and attach the incomplete files.";

const SAMPLE_ATTACHMENTS: RequestAttachment[] = [
  {
    id: "a1",
    name: "الهوية الوطنية",
    nameEn: "National ID",
    kind: "pdf",
  },
  {
    id: "a2",
    name: "عنوان المرفق",
    nameEn: "Attachment title",
    kind: "image",
  },
];

const HELP_DESC_AR =
  "طلب مساعدة مالية لسداد الرسوم الدراسية للعام/الفصل الدراسي 2025/2026 وذلك لاستكمال مسيرتي التعليمية. آمل منكم قبول الطلب ولكم جزيل الشكر.";
const HELP_DESC_EN =
  "Financial assistance request to pay tuition fees for the 2025/2026 academic year/semester to continue my education. I hope you accept the request, thank you.";

const DEFAULT_NATIONAL_ID = "1028172728";

export const REQUEST_CATEGORIES: RequestCategory[] = [
  "help",
  "consult",
  "offers",
  "news",
  "booking",
];

export const REQUEST_STATUSES: RequestStatus[] = [
  "pending",
  "approved",
  "rejected",
];

export const DUMMY_REQUESTS: DummyRequest[] = [
  // Help — pending (4+ for show more)
  {
    id: "h-p1",
    category: "help",
    status: "pending",
    title: "طلب رسوم الدراسة",
    titleEn: "Tuition fees request",
    typeLabel: "مساعدة تعليمية",
    typeLabelEn: "Education assistance",
    requestCode: "8562",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "22 مايو 2025 - 09:22 مساءً",
    dateLabelEn: "22 May 2025 - 09:22 PM",
    description: HELP_DESC_AR,
    descriptionEn: HELP_DESC_EN,
    attachments: SAMPLE_ATTACHMENTS,
  },
  {
    id: "h-p2",
    category: "help",
    status: "pending",
    title: "طلب الزواج",
    titleEn: "Marriage request",
    typeLabel: "مساعدة زواج",
    typeLabelEn: "Marriage assistance",
    requestCode: "8563",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "21 مايو 2025 - 08:10 مساءً",
    dateLabelEn: "21 May 2025 - 08:10 PM",
    description: HELP_DESC_AR,
    descriptionEn: HELP_DESC_EN,
  },
  {
    id: "h-p3",
    category: "help",
    status: "pending",
    title: "طلب مساعدة طبية",
    titleEn: "Medical assistance request",
    typeLabel: "مساعدة طبية",
    typeLabelEn: "Medical assistance",
    requestCode: "8564",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "20 مايو 2025 - 07:00 مساءً",
    dateLabelEn: "20 May 2025 - 07:00 PM",
    description: HELP_DESC_AR,
    descriptionEn: HELP_DESC_EN,
    attachments: [SAMPLE_ATTACHMENTS[0]],
  },
  {
    id: "h-p4",
    category: "help",
    status: "pending",
    title: "طلب دعم سكني",
    titleEn: "Housing support request",
    typeLabel: "دعم سكني",
    typeLabelEn: "Housing support",
    requestCode: "8565",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "19 مايو 2025 - 06:30 مساءً",
    dateLabelEn: "19 May 2025 - 06:30 PM",
    description: HELP_DESC_AR,
    descriptionEn: HELP_DESC_EN,
  },
  // Help — approved
  {
    id: "h-a1",
    category: "help",
    status: "approved",
    title: "طلب مساعدة مالية",
    titleEn: "Financial assistance request",
    typeLabel: "مساعدة مالية",
    typeLabelEn: "Financial assistance",
    requestCode: "8562",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "22 مايو 2025 - 09:22 مساءً",
    dateLabelEn: "22 May 2025 - 09:22 PM",
    description: HELP_DESC_AR,
    descriptionEn: HELP_DESC_EN,
    attachments: SAMPLE_ATTACHMENTS,
  },
  {
    id: "h-a2",
    category: "help",
    status: "approved",
    title: "طلب دعم تعليمي",
    titleEn: "Education support request",
    typeLabel: "مساعدة تعليمية",
    typeLabelEn: "Education assistance",
    requestCode: "8501",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "17 مايو 2025 - 04:00 مساءً",
    dateLabelEn: "17 May 2025 - 04:00 PM",
    description: HELP_DESC_AR,
    descriptionEn: HELP_DESC_EN,
  },
  {
    id: "h-a3",
    category: "help",
    status: "approved",
    title: "طلب مساعدة عاجلة",
    titleEn: "Urgent assistance request",
    typeLabel: "مساعدة عاجلة",
    typeLabelEn: "Urgent assistance",
    requestCode: "8502",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "16 مايو 2025 - 03:20 مساءً",
    dateLabelEn: "16 May 2025 - 03:20 PM",
    description: HELP_DESC_AR,
    descriptionEn: HELP_DESC_EN,
    attachments: SAMPLE_ATTACHMENTS,
  },
  {
    id: "h-a4",
    category: "help",
    status: "approved",
    title: "طلب رعاية أسرية",
    titleEn: "Family care request",
    typeLabel: "رعاية أسرية",
    typeLabelEn: "Family care",
    requestCode: "8503",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "15 مايو 2025 - 02:10 مساءً",
    dateLabelEn: "15 May 2025 - 02:10 PM",
    description: HELP_DESC_AR,
    descriptionEn: HELP_DESC_EN,
  },
  // Help — rejected
  {
    id: "h-r1",
    category: "help",
    status: "rejected",
    title: "طلب الزواج",
    titleEn: "Marriage request",
    typeLabel: "مساعدة زواج",
    typeLabelEn: "Marriage assistance",
    requestCode: "8490",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "14 مايو 2025 - 09:22 مساءً",
    dateLabelEn: "14 May 2025 - 09:22 PM",
    description: HELP_DESC_AR,
    descriptionEn: HELP_DESC_EN,
    rejectionReason: REJECTION_AR,
    rejectionReasonEn: REJECTION_EN,
  },
  {
    id: "h-r2",
    category: "help",
    status: "rejected",
    title: "طلب مساعدة سفر",
    titleEn: "Travel assistance request",
    typeLabel: "مساعدة سفر",
    typeLabelEn: "Travel assistance",
    requestCode: "8491",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "13 مايو 2025 - 11:00 صباحاً",
    dateLabelEn: "13 May 2025 - 11:00 AM",
    description: HELP_DESC_AR,
    descriptionEn: HELP_DESC_EN,
    rejectionReason: REJECTION_AR,
    rejectionReasonEn: REJECTION_EN,
    attachments: [SAMPLE_ATTACHMENTS[1]],
  },
  // Consult — pending / approved / rejected
  {
    id: "c-p1",
    category: "consult",
    status: "pending",
    title: "استشارة حول تربية الأبناء",
    titleEn: "Consultation on raising children",
    requestCode: "8601",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "22 مايو 2025 - 09:22 مساءً",
    dateLabelEn: "22 May 2025 - 09:22 PM",
    consultType: "استشارة أسرية",
    consultTypeEn: "Family consultation",
    description:
      "أرغب في الحصول على استشارة بخصوص أساليب تربية الأبناء في مرحلة المراهقة وكيفية التعامل مع التحديات اليومية.",
    descriptionEn:
      "I would like advice on parenting teens and handling daily challenges.",
  },
  {
    id: "c-p2",
    category: "consult",
    status: "pending",
    title: "استشارة تعليمية للمنح الدراسية",
    titleEn: "Education consultation for scholarships",
    requestCode: "8602",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "21 مايو 2025 - 07:40 مساءً",
    dateLabelEn: "21 May 2025 - 07:40 PM",
    consultType: "استشارة تعليمية",
    consultTypeEn: "Education consultation",
    description:
      "أحتاج توجيهاً حول أفضل الخيارات للمنح الدراسية داخل المملكة وخارجها.",
    descriptionEn:
      "I need guidance on the best scholarship options inside and outside the Kingdom.",
  },
  {
    id: "c-p3",
    category: "consult",
    status: "pending",
    title: "استشارة بخصوص التخطيط المالي للأسرة",
    titleEn: "Family financial planning consultation",
    requestCode: "8603",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "20 مايو 2025 - 06:15 مساءً",
    dateLabelEn: "20 May 2025 - 06:15 PM",
    consultType: "استشارة مالية",
    consultTypeEn: "Financial consultation",
    description:
      "أرغب في استشارة حول تنظيم ميزانية الأسرة وادخار جزء من الدخل بشكل مستدام.",
    descriptionEn:
      "I want advice on organizing the family budget and sustainable saving.",
  },
  {
    id: "c-p4",
    category: "consult",
    status: "pending",
    title: "استشارة قانونية بشأن الوصية",
    titleEn: "Legal consultation about a will",
    requestCode: "8604",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "19 مايو 2025 - 05:00 مساءً",
    dateLabelEn: "19 May 2025 - 05:00 PM",
    consultType: "استشارة قانونية",
    consultTypeEn: "Legal consultation",
    description: "أحتاج توضيحاً حول إجراءات إعداد وصية شرعية بشكل صحيح.",
    descriptionEn:
      "I need clarification on the correct procedures for preparing a Sharia-compliant will.",
  },
  {
    id: "c-a1",
    category: "consult",
    status: "approved",
    title: "استشارة حول تربية الأبناء",
    titleEn: "Consultation on raising children",
    requestCode: "8562",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "22 مايو 2025 - 09:22 مساءً",
    dateLabelEn: "22 May 2025 - 09:22 PM",
    consultType: "استشارة أسرية",
    consultTypeEn: "Family consultation",
    description: HELP_DESC_AR,
    descriptionEn: HELP_DESC_EN,
    response:
      "ننصح بتخصيص وقت أسبوعي للحوار الأسري، والتركيز على الاستماع الفعّال قبل التوجيه. كما نرفق لكم كتيباً يساعد في إدارة الأسرة بشكل أفضل.",
    responseEn:
      "We recommend a weekly family dialogue time and focusing on active listening before giving guidance. We also attached a booklet to help with family management.",
    replies: [
      {
        id: "cr-a1-1",
        author: "راشد صالح",
        authorEn: "Rashid Saleh",
        dateLabel: "22 مايو 2025 - 09:22 مساءً",
        dateLabelEn: "22 May 2025 - 09:22 PM",
        text: "ننصح بتخصيص وقت أسبوعي للحوار الأسري، والتركيز على الاستماع الفعّال قبل التوجيه. كما نرفق لكم كتيباً يساعد في إدارة الأسرة بشكل أفضل.",
        textEn:
          "We recommend a weekly family dialogue time and focusing on active listening before giving guidance. We also attached a booklet to help with family management.",
        attachments: [
          {
            id: "c-att-1",
            name: "كتيب إدارة الأسرة",
            nameEn: "Family management booklet",
            kind: "pdf",
          },
          {
            id: "c-att-2",
            name: "عنوان المرفق",
            nameEn: "Attachment title",
            kind: "image",
          },
        ],
      },
      {
        id: "cr-a1-2",
        author: "محمد بن عبدالعزيز",
        authorEn: "Mohammed bin Abdulaziz",
        dateLabel: "22 مايو 2025 - 10:12 مساءً",
        dateLabelEn: "22 May 2025 - 10:12 PM",
        text: "شكرًا على ردك المفيد، جزاكم الله كل خير",
        textEn: "Thank you for your useful reply, may God reward you with all good.",
      },
    ],
  },
  {
    id: "c-a2",
    category: "consult",
    status: "approved",
    title: "استشارة تعليمية لاختيار التخصص",
    titleEn: "Education consultation for choosing a major",
    requestCode: "8566",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "17 مايو 2025 - 03:10 مساءً",
    dateLabelEn: "17 May 2025 - 03:10 PM",
    consultType: "استشارة تعليمية",
    consultTypeEn: "Education consultation",
    description: "طلب توجيه حول اختيار التخصص الجامعي المناسب.",
    descriptionEn: "Guidance requested on choosing a suitable university major.",
    response:
      "يفضّل إجراء اختبار ميول مهنية ومقارنة فرص سوق العمل قبل اتخاذ القرار النهائي.",
    responseEn:
      "It is preferable to take a career aptitude test and compare labor-market opportunities before deciding.",
    replies: [
      {
        id: "cr-a2-1",
        author: "راشد صالح",
        authorEn: "Rashid Saleh",
        dateLabel: "17 مايو 2025 - 04:00 مساءً",
        dateLabelEn: "17 May 2025 - 04:00 PM",
        text: "يفضّل إجراء اختبار ميول مهنية ومقارنة فرص سوق العمل قبل اتخاذ القرار النهائي.",
        textEn:
          "It is preferable to take a career aptitude test and compare labor-market opportunities before deciding.",
      },
    ],
  },
  {
    id: "c-a3",
    category: "consult",
    status: "approved",
    title: "استشارة مالية للادخار",
    titleEn: "Financial consultation for saving",
    requestCode: "8567",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "16 مايو 2025 - 02:00 مساءً",
    dateLabelEn: "16 May 2025 - 02:00 PM",
    consultType: "استشارة مالية",
    consultTypeEn: "Financial consultation",
    description: "استشارة حول أفضل طرق الادخار الشهري للأسرة.",
    descriptionEn: "Consultation about the best monthly family saving methods.",
    response: "ابدأ بادخار نسبة ثابتة من الدخل فور استلامه قبل أي مصروف غير ضروري.",
    responseEn:
      "Start by saving a fixed percentage of income as soon as it is received, before non-essential spending.",
    replies: [
      {
        id: "cr-a3-1",
        author: "راشد صالح",
        authorEn: "Rashid Saleh",
        dateLabel: "16 مايو 2025 - 03:00 مساءً",
        dateLabelEn: "16 May 2025 - 03:00 PM",
        text: "ابدأ بادخار نسبة ثابتة من الدخل فور استلامه قبل أي مصروف غير ضروري.",
        textEn:
          "Start by saving a fixed percentage of income as soon as it is received, before non-essential spending.",
      },
    ],
  },
  {
    id: "c-a4",
    category: "consult",
    status: "approved",
    title: "استشارة قانونية للعقود",
    titleEn: "Legal consultation for contracts",
    requestCode: "8568",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "15 مايو 2025 - 01:30 مساءً",
    dateLabelEn: "15 May 2025 - 01:30 PM",
    consultType: "استشارة قانونية",
    consultTypeEn: "Legal consultation",
    description: "طلب مراجعة بنود عقد إيجار قبل التوقيع.",
    descriptionEn: "Request to review lease contract clauses before signing.",
    response:
      "يرجى التأكد من مدة العقد وبنود الصيانة وشرط الإنهاء المبكر قبل التوقيع.",
    responseEn:
      "Please confirm the contract duration, maintenance clauses, and early-termination terms before signing.",
    replies: [
      {
        id: "cr-a4-1",
        author: "راشد صالح",
        authorEn: "Rashid Saleh",
        dateLabel: "15 مايو 2025 - 02:15 مساءً",
        dateLabelEn: "15 May 2025 - 02:15 PM",
        text: "يرجى التأكد من مدة العقد وبنود الصيانة وشرط الإنهاء المبكر قبل التوقيع.",
        textEn:
          "Please confirm the contract duration, maintenance clauses, and early-termination terms before signing.",
        attachments: [
          {
            id: "c-att-3",
            name: "نموذج مراجعة العقود",
            nameEn: "Contract review template",
            kind: "pdf",
          },
        ],
      },
    ],
  },
  {
    id: "c-r1",
    category: "consult",
    status: "rejected",
    title: "استشارة عاجلة غير مكتملة",
    titleEn: "Incomplete urgent consultation",
    requestCode: "8495",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "14 مايو 2025 - 11:45 صباحاً",
    dateLabelEn: "14 May 2025 - 11:45 AM",
    consultType: "استشارة أسرية",
    consultTypeEn: "Family consultation",
    description: "طلب استشارة دون إرفاق التفاصيل الكافية.",
    descriptionEn: "Consultation request without enough details.",
    rejectionReason: REJECTION_AR,
    rejectionReasonEn: REJECTION_EN,
  },
  {
    id: "c-r2",
    category: "consult",
    status: "rejected",
    title: "استشارة مالية ناقصة المستندات",
    titleEn: "Financial consultation missing documents",
    requestCode: "8496",
    nationalId: DEFAULT_NATIONAL_ID,
    dateLabel: "13 مايو 2025 - 10:20 صباحاً",
    dateLabelEn: "13 May 2025 - 10:20 AM",
    consultType: "استشارة مالية",
    consultTypeEn: "Financial consultation",
    description: "تم رفض الطلب لنقص المرفقات الداعمة.",
    descriptionEn: "The request was rejected due to missing supporting attachments.",
    rejectionReason: REJECTION_AR,
    rejectionReasonEn: REJECTION_EN,
  },
  // offers uses DUMMY_OFFERS (see dummy-offers.ts)
  // news & booking intentionally empty for empty-state demo
];

export function getRequestsByCategory(
  category: RequestCategory,
): DummyRequest[] {
  return DUMMY_REQUESTS.filter((item) => item.category === category);
}

export function getRequestById(id: string): DummyRequest | undefined {
  return DUMMY_REQUESTS.find((item) => item.id === id);
}

export function getCategoryCounts(): Record<RequestCategory, number> {
  return REQUEST_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = getRequestsByCategory(category).length;
      return acc;
    },
    {} as Record<RequestCategory, number>,
  );
}

export function groupByStatus(
  items: DummyRequest[],
): Record<RequestStatus, DummyRequest[]> {
  return {
    pending: items.filter((i) => i.status === "pending"),
    approved: items.filter((i) => i.status === "approved"),
    rejected: items.filter((i) => i.status === "rejected"),
  };
}
