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
  consultType?: string;
  consultTypeEn?: string;
  response?: string;
  responseEn?: string;
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
    dateLabel: "22 مايو 2025 - 09:22 مساءً",
    dateLabelEn: "22 May 2025 - 09:22 PM",
    rejectionReason: REJECTION_AR,
    rejectionReasonEn: REJECTION_EN,
    attachments: SAMPLE_ATTACHMENTS,
  },
  {
    id: "h-p2",
    category: "help",
    status: "pending",
    title: "طلب الزواج",
    titleEn: "Marriage request",
    dateLabel: "21 مايو 2025 - 08:10 مساءً",
    dateLabelEn: "21 May 2025 - 08:10 PM",
  },
  {
    id: "h-p3",
    category: "help",
    status: "pending",
    title: "طلب مساعدة طبية",
    titleEn: "Medical assistance request",
    dateLabel: "20 مايو 2025 - 07:00 مساءً",
    dateLabelEn: "20 May 2025 - 07:00 PM",
    attachments: [SAMPLE_ATTACHMENTS[0]],
  },
  {
    id: "h-p4",
    category: "help",
    status: "pending",
    title: "طلب دعم سكني",
    titleEn: "Housing support request",
    dateLabel: "19 مايو 2025 - 06:30 مساءً",
    dateLabelEn: "19 May 2025 - 06:30 PM",
  },
  // Help — approved
  {
    id: "h-a1",
    category: "help",
    status: "approved",
    title: "طلب مساعدة مالية",
    titleEn: "Financial assistance request",
    dateLabel: "18 مايو 2025 - 05:15 مساءً",
    dateLabelEn: "18 May 2025 - 05:15 PM",
    attachments: SAMPLE_ATTACHMENTS,
  },
  {
    id: "h-a2",
    category: "help",
    status: "approved",
    title: "طلب دعم تعليمي",
    titleEn: "Education support request",
    dateLabel: "17 مايو 2025 - 04:00 مساءً",
    dateLabelEn: "17 May 2025 - 04:00 PM",
  },
  {
    id: "h-a3",
    category: "help",
    status: "approved",
    title: "طلب مساعدة عاجلة",
    titleEn: "Urgent assistance request",
    dateLabel: "16 مايو 2025 - 03:20 مساءً",
    dateLabelEn: "16 May 2025 - 03:20 PM",
  },
  {
    id: "h-a4",
    category: "help",
    status: "approved",
    title: "طلب رعاية أسرية",
    titleEn: "Family care request",
    dateLabel: "15 مايو 2025 - 02:10 مساءً",
    dateLabelEn: "15 May 2025 - 02:10 PM",
  },
  // Help — rejected
  {
    id: "h-r1",
    category: "help",
    status: "rejected",
    title: "طلب الزواج",
    titleEn: "Marriage request",
    dateLabel: "14 مايو 2025 - 09:22 مساءً",
    dateLabelEn: "14 May 2025 - 09:22 PM",
    rejectionReason: REJECTION_AR,
    rejectionReasonEn: REJECTION_EN,
  },
  {
    id: "h-r2",
    category: "help",
    status: "rejected",
    title: "طلب مساعدة سفر",
    titleEn: "Travel assistance request",
    dateLabel: "13 مايو 2025 - 11:00 صباحاً",
    dateLabelEn: "13 May 2025 - 11:00 AM",
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
    dateLabel: "22 مايو 2025 - 09:22 مساءً",
    dateLabelEn: "22 May 2025 - 09:22 PM",
    consultType: "استشارات عائلية",
    consultTypeEn: "Family consultations",
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
    dateLabel: "21 مايو 2025 - 07:40 مساءً",
    dateLabelEn: "21 May 2025 - 07:40 PM",
    consultType: "استشارات تعليمية",
    consultTypeEn: "Education consultations",
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
    dateLabel: "20 مايو 2025 - 06:15 مساءً",
    dateLabelEn: "20 May 2025 - 06:15 PM",
    consultType: "استشارات مالية",
    consultTypeEn: "Financial consultations",
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
    dateLabel: "19 مايو 2025 - 05:00 مساءً",
    dateLabelEn: "19 May 2025 - 05:00 PM",
    consultType: "استشارات قانونية",
    consultTypeEn: "Legal consultations",
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
    dateLabel: "18 مايو 2025 - 04:20 مساءً",
    dateLabelEn: "18 May 2025 - 04:20 PM",
    consultType: "استشارات عائلية",
    consultTypeEn: "Family consultations",
    description:
      "تم تقديم طلب استشارة حول أساليب الحوار مع الأبناء في المنزل.",
    descriptionEn:
      "A consultation was submitted about dialogue methods with children at home.",
    response:
      "ننصح بتخصيص وقت أسبوعي للحوار الأسري، والتركيز على الاستماع الفعّال قبل التوجيه.",
    responseEn:
      "We recommend a weekly family dialogue time and focusing on active listening before giving guidance.",
    attachments: [
      {
        id: "c-att-1",
        name: "دليل إدارة الأسرة",
        nameEn: "Family management guide",
        kind: "pdf",
      },
      {
        id: "c-att-2",
        name: "صورة توضيحية",
        nameEn: "Illustrative image",
        kind: "image",
      },
    ],
  },
  {
    id: "c-a2",
    category: "consult",
    status: "approved",
    title: "استشارة تعليمية لاختيار التخصص",
    titleEn: "Education consultation for choosing a major",
    dateLabel: "17 مايو 2025 - 03:10 مساءً",
    dateLabelEn: "17 May 2025 - 03:10 PM",
    consultType: "استشارات تعليمية",
    consultTypeEn: "Education consultations",
    description: "طلب توجيه حول اختيار التخصص الجامعي المناسب.",
    descriptionEn: "Guidance requested on choosing a suitable university major.",
    response:
      "يفضّل إجراء اختبار ميول مهنية ومقارنة فرص سوق العمل قبل اتخاذ القرار النهائي.",
    responseEn:
      "It is preferable to take a career aptitude test and compare labor-market opportunities before deciding.",
  },
  {
    id: "c-a3",
    category: "consult",
    status: "approved",
    title: "استشارة مالية للادخار",
    titleEn: "Financial consultation for saving",
    dateLabel: "16 مايو 2025 - 02:00 مساءً",
    dateLabelEn: "16 May 2025 - 02:00 PM",
    consultType: "استشارات مالية",
    consultTypeEn: "Financial consultations",
    description: "استشارة حول أفضل طرق الادخار الشهري للأسرة.",
    descriptionEn: "Consultation about the best monthly family saving methods.",
    response: "ابدأ بادخار نسبة ثابتة من الدخل فور استلامه قبل أي مصروف غير ضروري.",
    responseEn:
      "Start by saving a fixed percentage of income as soon as it is received, before non-essential spending.",
  },
  {
    id: "c-a4",
    category: "consult",
    status: "approved",
    title: "استشارة قانونية للعقود",
    titleEn: "Legal consultation for contracts",
    dateLabel: "15 مايو 2025 - 01:30 مساءً",
    dateLabelEn: "15 May 2025 - 01:30 PM",
    consultType: "استشارات قانونية",
    consultTypeEn: "Legal consultations",
    description: "طلب مراجعة بنود عقد إيجار قبل التوقيع.",
    descriptionEn: "Request to review lease contract clauses before signing.",
    response:
      "يرجى التأكد من مدة العقد وبنود الصيانة وشرط الإنهاء المبكر قبل التوقيع.",
    responseEn:
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
  {
    id: "c-r1",
    category: "consult",
    status: "rejected",
    title: "استشارة عاجلة غير مكتملة",
    titleEn: "Incomplete urgent consultation",
    dateLabel: "14 مايو 2025 - 11:45 صباحاً",
    dateLabelEn: "14 May 2025 - 11:45 AM",
    consultType: "استشارات عائلية",
    consultTypeEn: "Family consultations",
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
    dateLabel: "13 مايو 2025 - 10:20 صباحاً",
    dateLabelEn: "13 May 2025 - 10:20 AM",
    consultType: "استشارات مالية",
    consultTypeEn: "Financial consultations",
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
