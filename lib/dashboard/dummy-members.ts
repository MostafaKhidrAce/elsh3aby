export type MemberRoleKind =
  | "president"
  | "vice_president"
  | "member"
  | "committee_head";

export type DummyBoardMember = {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  roleKind: MemberRoleKind;
  image: string;
  dateRange: string;
  dateRangeEn: string;
  votePercent?: number;
  voteCount?: number;
  showMedal?: boolean;
  bio: string;
  bioEn: string;
};

export type DummyPreviousBoard = {
  id: string;
  title: string;
  titleEn: string;
  dateRange: string;
  dateRangeEn: string;
  members: DummyBoardMember[];
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
  "يتمتع بخبرة واسعة في العمل الخيري والإداري داخل الأسرة، ويؤمن بقيم التعاون والشفافية. مهتم بتطوير اللائحة الداخلية للصندوق بما يحقق العدالة والوضوح في توزيع الدعم.\n\nيسعى لتعزيز مشاركة الأعضاء وتطوير آليات العمل بما يخدم مصلحة العائلة ويحقق أهداف الصندوق الاستراتيجية.";
const BIO_EN =
  "He has extensive experience in charitable and administrative work within the family, and believes in cooperation and transparency. He is interested in developing the fund's internal regulations to achieve fairness and clarity in support distribution.\n\nHe seeks to enhance member participation and develop work mechanisms that serve the family's interest and achieve the fund's strategic goals.";

const DATE_CURRENT_AR = "يوليو 2025 - مايو 2027";
const DATE_CURRENT_EN = "July 2025 - May 2027";

function member(
  partial: Omit<DummyBoardMember, "bio" | "bioEn"> & {
    bio?: string;
    bioEn?: string;
  },
): DummyBoardMember {
  return {
    bio: BIO_AR,
    bioEn: BIO_EN,
    ...partial,
  };
}

export const CURRENT_BOARD_MEMBERS: DummyBoardMember[] = [
  member({
    id: "cm1",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "رئيس مجلس إدارة الصندوق",
    roleEn: "Chairman of the Fund Board",
    roleKind: "president",
    image: PORTRAIT_1,
    dateRange: DATE_CURRENT_AR,
    dateRangeEn: DATE_CURRENT_EN,
    showMedal: true,
    votePercent: 62,
    voteCount: 326,
  }),
  member({
    id: "cm2",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "نائب رئيس مجلس إدارة الصندوق",
    roleEn: "Vice Chairman of the Fund Board",
    roleKind: "vice_president",
    image: PORTRAIT_2,
    dateRange: DATE_CURRENT_AR,
    dateRangeEn: DATE_CURRENT_EN,
    showMedal: true,
    votePercent: 58,
    voteCount: 298,
  }),
  member({
    id: "cm3",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "عضو",
    roleEn: "Member",
    roleKind: "member",
    image: PORTRAIT_3,
    dateRange: DATE_CURRENT_AR,
    dateRangeEn: DATE_CURRENT_EN,
    votePercent: 54,
    voteCount: 312,
  }),
  member({
    id: "cm4",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "عضو",
    roleEn: "Member",
    roleKind: "member",
    image: PORTRAIT_4,
    dateRange: DATE_CURRENT_AR,
    dateRangeEn: DATE_CURRENT_EN,
    votePercent: 51,
    voteCount: 280,
  }),
  member({
    id: "cm5",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "عضو",
    roleEn: "Member",
    roleKind: "member",
    image: PORTRAIT_5,
    dateRange: DATE_CURRENT_AR,
    dateRangeEn: DATE_CURRENT_EN,
    votePercent: 49,
    voteCount: 265,
  }),
  member({
    id: "cm6",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "رئيس اللجنة المالية",
    roleEn: "Head of the Financial Committee",
    roleKind: "committee_head",
    image: PORTRAIT_6,
    dateRange: DATE_CURRENT_AR,
    dateRangeEn: DATE_CURRENT_EN,
    showMedal: true,
    votePercent: 55,
    voteCount: 301,
  }),
];

function boardMembers(seed: number): DummyBoardMember[] {
  const portraits = [
    PORTRAIT_1,
    PORTRAIT_2,
    PORTRAIT_3,
    PORTRAIT_4,
    PORTRAIT_5,
    PORTRAIT_6,
  ];
  return [
    member({
      id: `b${seed}-p`,
      name: "عبدالله سلطان",
      nameEn: "Abdullah Sultan",
      role: "رئيس مجلس إدارة الصندوق",
      roleEn: "Chairman of the Fund Board",
      roleKind: "president",
      image: portraits[seed % portraits.length],
      dateRange: `يوليو ${2020 + seed} - مايو ${2022 + seed}`,
      dateRangeEn: `July ${2020 + seed} - May ${2022 + seed}`,
      showMedal: true,
      votePercent: 54 + seed,
      voteCount: 300 + seed * 3,
    }),
    member({
      id: `b${seed}-v`,
      name: "عبدالله سلطان",
      nameEn: "Abdullah Sultan",
      role: "نائب رئيس المجلس الأسبق",
      roleEn: "Former Vice Chairman of the Board",
      roleKind: "vice_president",
      image: portraits[(seed + 1) % portraits.length],
      dateRange: `يوليو ${2020 + seed} - مايو ${2022 + seed}`,
      dateRangeEn: `July ${2020 + seed} - May ${2022 + seed}`,
      showMedal: true,
      votePercent: 62,
      voteCount: 326,
    }),
    member({
      id: `b${seed}-m1`,
      name: "عبدالله سلطان",
      nameEn: "Abdullah Sultan",
      role: "عضو",
      roleEn: "Member",
      roleKind: "member",
      image: portraits[(seed + 2) % portraits.length],
      dateRange: `يوليو ${2020 + seed} - مايو ${2022 + seed}`,
      dateRangeEn: `July ${2020 + seed} - May ${2022 + seed}`,
      showMedal: true,
      votePercent: 54,
      voteCount: 312,
    }),
    member({
      id: `b${seed}-m2`,
      name: "عبدالله سلطان",
      nameEn: "Abdullah Sultan",
      role: "عضو",
      roleEn: "Member",
      roleKind: "member",
      image: portraits[(seed + 3) % portraits.length],
      dateRange: `يوليو ${2020 + seed} - مايو ${2022 + seed}`,
      dateRangeEn: `July ${2020 + seed} - May ${2022 + seed}`,
      votePercent: 48,
      voteCount: 250,
    }),
    member({
      id: `b${seed}-m3`,
      name: "عبدالله سلطان",
      nameEn: "Abdullah Sultan",
      role: "عضو",
      roleEn: "Member",
      roleKind: "member",
      image: portraits[(seed + 4) % portraits.length],
      dateRange: `يوليو ${2020 + seed} - مايو ${2022 + seed}`,
      dateRangeEn: `July ${2020 + seed} - May ${2022 + seed}`,
      votePercent: 47,
      voteCount: 240,
    }),
    member({
      id: `b${seed}-m4`,
      name: "عبدالله سلطان",
      nameEn: "Abdullah Sultan",
      role: "عضو",
      roleEn: "Member",
      roleKind: "member",
      image: portraits[(seed + 5) % portraits.length],
      dateRange: `يوليو ${2020 + seed} - مايو ${2022 + seed}`,
      dateRangeEn: `July ${2020 + seed} - May ${2022 + seed}`,
      votePercent: 45,
      voteCount: 220,
    }),
  ];
}

export const PREVIOUS_BOARDS: DummyPreviousBoard[] = [
  {
    id: "board-9",
    title: "المجلس الإداري للأسرة رقم 9",
    titleEn: "Family Administrative Board No. 9",
    dateRange: "يوليو 2023 - مايو 2025",
    dateRangeEn: "July 2023 - May 2025",
    members: boardMembers(9),
  },
  {
    id: "board-8",
    title: "المجلس الإداري للأسرة رقم 8",
    titleEn: "Family Administrative Board No. 8",
    dateRange: "يوليو 2021 - مايو 2023",
    dateRangeEn: "July 2021 - May 2023",
    members: boardMembers(8),
  },
  {
    id: "board-7",
    title: "المجلس الإداري للأسرة رقم 7",
    titleEn: "Family Administrative Board No. 7",
    dateRange: "يوليو 2019 - مايو 2021",
    dateRangeEn: "July 2019 - May 2021",
    members: boardMembers(7),
  },
  {
    id: "board-6",
    title: "المجلس الإداري للأسرة رقم 6",
    titleEn: "Family Administrative Board No. 6",
    dateRange: "يوليو 2017 - مايو 2019",
    dateRangeEn: "July 2017 - May 2019",
    members: boardMembers(6),
  },
  {
    id: "board-5",
    title: "المجلس الإداري للأسرة رقم 5",
    titleEn: "Family Administrative Board No. 5",
    dateRange: "يوليو 2015 - مايو 2017",
    dateRangeEn: "July 2015 - May 2017",
    members: boardMembers(5),
  },
  {
    id: "board-4",
    title: "المجلس الإداري للأسرة رقم 4",
    titleEn: "Family Administrative Board No. 4",
    dateRange: "يوليو 2013 - مايو 2015",
    dateRangeEn: "July 2013 - May 2015",
    members: boardMembers(4),
  },
];

export const BOARD_CARD_IMAGE = "/backgrounds/res-members-img.svg";

export function getPreviousBoardById(
  id: string,
): DummyPreviousBoard | undefined {
  return PREVIOUS_BOARDS.find((board) => board.id === id);
}

export function getMemberById(
  id: string,
): DummyBoardMember | undefined {
  const fromCurrent = CURRENT_BOARD_MEMBERS.find((m) => m.id === id);
  if (fromCurrent) return fromCurrent;
  for (const board of PREVIOUS_BOARDS) {
    const found = board.members.find((m) => m.id === id);
    if (found) return found;
  }
  return undefined;
}

export type MemberSectionId = "president" | "vice_president" | "members";

export function groupBoardMembers(
  members: DummyBoardMember[],
): Record<MemberSectionId, DummyBoardMember[]> {
  return {
    president: members.filter((m) => m.roleKind === "president"),
    vice_president: members.filter((m) => m.roleKind === "vice_president"),
    members: members.filter(
      (m) => m.roleKind === "member" || m.roleKind === "committee_head",
    ),
  };
}
