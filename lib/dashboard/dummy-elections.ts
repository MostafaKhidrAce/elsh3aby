export type ElectionPhase = "nominate" | "vote";

export type ElectionRoleId = "president" | "vice_president" | "member";

export type ElectionCandidateFile = {
  id: string;
  name: string;
  nameEn: string;
  kind: "pdf" | "docx";
};

export type ElectionCandidate = {
  id: string;
  roleId: ElectionRoleId;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  image: string;
  showMedal?: boolean;
  votePercent: number;
  voteCount: number;
  bio: string;
  bioEn: string;
  files: ElectionCandidateFile[];
};

/** Switch to "nominate" to show stats + nomination CTA instead of voting lists. */
export const ELECTIONS_PHASE: ElectionPhase = "vote";

export const ELECTIONS_DEADLINE = new Date("2027-02-20T23:59:59");

export const ELECTION_STATS = {
  president: 50,
  vicePresident: 33,
  member: 33,
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

const SAMPLE_FILES: ElectionCandidateFile[] = [
  { id: "f1", name: "ملف CV (PDF)", nameEn: "CV file (PDF)", kind: "pdf" },
  {
    id: "f2",
    name: "انجازات (DOCX)",
    nameEn: "Achievements (DOCX)",
    kind: "docx",
  },
  { id: "f3", name: "ملف CV (PDF)", nameEn: "CV file (PDF)", kind: "pdf" },
];

export const ELECTION_CANDIDATES: ElectionCandidate[] = [
  {
    id: "ec-p1",
    roleId: "president",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "رئيس مجلس إدارة الصندوق",
    roleEn: "Chairman of the Fund Board",
    image: PORTRAIT_1,
    showMedal: true,
    votePercent: 54,
    voteCount: 312,
    bio: BIO_AR,
    bioEn: BIO_EN,
    files: SAMPLE_FILES,
  },
  {
    id: "ec-p2",
    roleId: "president",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "رئيس مجلس إدارة الصندوق",
    roleEn: "Chairman of the Fund Board",
    image: PORTRAIT_2,
    showMedal: true,
    votePercent: 46,
    voteCount: 268,
    bio: BIO_AR,
    bioEn: BIO_EN,
    files: SAMPLE_FILES,
  },
  {
    id: "ec-v1",
    roleId: "vice_president",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "نائب رئيس مجلس إدارة الصندوق",
    roleEn: "Vice Chairman of the Fund Board",
    image: PORTRAIT_3,
    showMedal: true,
    votePercent: 54,
    voteCount: 312,
    bio: BIO_AR,
    bioEn: BIO_EN,
    files: SAMPLE_FILES,
  },
  {
    id: "ec-v2",
    roleId: "vice_president",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "نائب رئيس مجلس إدارة الصندوق",
    roleEn: "Vice Chairman of the Fund Board",
    image: PORTRAIT_4,
    showMedal: true,
    votePercent: 48,
    voteCount: 290,
    bio: BIO_AR,
    bioEn: BIO_EN,
    files: SAMPLE_FILES,
  },
  {
    id: "ec-v3",
    roleId: "vice_president",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "نائب رئيس مجلس إدارة الصندوق",
    roleEn: "Vice Chairman of the Fund Board",
    image: PORTRAIT_5,
    votePercent: 42,
    voteCount: 255,
    bio: BIO_AR,
    bioEn: BIO_EN,
    files: SAMPLE_FILES,
  },
  {
    id: "ec-m1",
    roleId: "member",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "عضو مجلس إدارة الصندوق",
    roleEn: "Fund Board Member",
    image: PORTRAIT_6,
    showMedal: true,
    votePercent: 54,
    voteCount: 312,
    bio: BIO_AR,
    bioEn: BIO_EN,
    files: SAMPLE_FILES,
  },
  {
    id: "ec-m2",
    roleId: "member",
    name: "عبدالله سلطان",
    nameEn: "Abdullah Sultan",
    role: "عضو مجلس إدارة الصندوق",
    roleEn: "Fund Board Member",
    image: PORTRAIT_1,
    votePercent: 40,
    voteCount: 210,
    bio: BIO_AR,
    bioEn: BIO_EN,
    files: SAMPLE_FILES,
  },
];

export const ELECTION_ROLE_ORDER: ElectionRoleId[] = [
  "president",
  "vice_president",
  "member",
];

export function getElectionCandidateById(
  id: string,
): ElectionCandidate | undefined {
  return ELECTION_CANDIDATES.find((c) => c.id === id);
}

export function groupElectionCandidates(): Record<
  ElectionRoleId,
  ElectionCandidate[]
> {
  return {
    president: ELECTION_CANDIDATES.filter((c) => c.roleId === "president"),
    vice_president: ELECTION_CANDIDATES.filter(
      (c) => c.roleId === "vice_president",
    ),
    member: ELECTION_CANDIDATES.filter((c) => c.roleId === "member"),
  };
}
