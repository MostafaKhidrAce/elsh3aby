import { apiGet, apiGetPage, type ApiQuery } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import { pickLocalized, resolveMedia } from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";
import type {
  DummyBoardMember,
  DummyPreviousBoard,
  MemberRoleKind,
} from "@/lib/dashboard/dummy-members";

type Named = { id?: number; name_ar?: string | null; name_en?: string | null; name?: string | null };

type ApiCouncil = {
  id: number;
  name?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
    title?: string | null;
    title_ar?: string | null;
    title_en?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  is_current?: boolean;
  current?: boolean;
  members?: ApiCouncilMember[];
};

type ApiCouncilMember = {
  id: number;
  name?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  position?: string | null;
  position_ar?: string | null;
  position_en?: string | null;
  role?: string | null;
  image?: string | null;
  image_url?: string | null;
  bio?: string | null;
  bio_ar?: string | null;
  vote_percent?: number | null;
  vote_count?: number | null;
  votes_count?: number | null;
};

function roleKind(value?: string | null): MemberRoleKind {
  const raw = (value || "").toLowerCase();
  if (raw.includes("vice") || raw.includes("نائب")) return "vice_president";
  if (raw.includes("president") || raw.includes("رئيس") && !raw.includes("لجن")) {
    return "president";
  }
  if (raw.includes("committee") || raw.includes("لجن")) return "committee_head";
  return "member";
}

function dateRange(item: ApiCouncil, locale: Locale): { ar: string; en: string } {
  const from = (item.start_date || item.date_from || "").slice(0, 10);
  const to = (item.end_date || item.date_to || "").slice(0, 10);
  const label = [from, to].filter(Boolean).join(" - ");
  return { ar: label, en: label };
}

export function toBoardMember(
  item: ApiCouncilMember,
  locale: Locale,
  range: { ar: string; en: string },
): DummyBoardMember {
  const name = item.name_ar || item.name || item.name_en || "";
  const role = item.position_ar || item.position || item.role || item.position_en || "";
  const kind = roleKind(role);
  return {
    id: String(item.id),
    name,
    nameEn: item.name_en || item.name || name,
    role,
    roleEn: item.position_en || item.position || role,
    roleKind: kind,
    image: resolveMedia(item.image_url || item.image),
    dateRange: range.ar,
    dateRangeEn: range.en,
    votePercent: item.vote_percent ?? undefined,
    voteCount: item.vote_count ?? item.votes_count ?? undefined,
    showMedal: kind === "president",
    bio: item.bio_ar || item.bio || "",
    bioEn: item.bio || item.bio_ar || "",
  };
}

export function toPreviousBoard(item: ApiCouncil, locale: Locale): DummyPreviousBoard {
  const range = dateRange(item, locale);
  const title = pickLocalized(locale, item.name_ar || item.title_ar, item.name_en || item.title_en, item.name || item.title || "");
  return {
    id: String(item.id),
    title,
    titleEn: item.name_en || item.title || title,
    dateRange: range.ar,
    dateRangeEn: range.en,
    members: (item.members ?? []).map((member) => toBoardMember(member, locale, range)),
  };
}

export async function getCouncils(locale: Locale, token: string, query?: ApiQuery) {
  const page = await apiGetPage<ApiCouncil[]>("/councils", locale, token, {
    per_page: 50,
    ...query,
  });
  return asList<ApiCouncil>(page.data);
}

export async function getCouncil(id: string | number, locale: Locale, token: string) {
  return apiGet<ApiCouncil>(`/councils/${id}`, locale, token);
}

export async function getCouncilMembers(
  id: string | number,
  locale: Locale,
  token: string,
) {
  const data = await apiGet<ApiCouncilMember[]>(`/councils/${id}/members`, locale, token);
  return asList<ApiCouncilMember>(data);
}

export async function getCurrentBoard(locale: Locale, token: string) {
  const councils = await getCouncils(locale, token, { current_only: true });
  const current =
    councils.find((item) => item.is_current || item.current) ?? councils[0];
  if (!current) return { council: null, members: [] as DummyBoardMember[] };
  const range = dateRange(current, locale);
  let members = current.members ?? [];
  if (!members.length) {
    members = await getCouncilMembers(current.id, locale, token);
  }
  return {
    council: current,
    members: members.map((member) => toBoardMember(member, locale, range)),
  };
}

export async function getPreviousBoards(locale: Locale, token: string) {
  const councils = await getCouncils(locale, token, { previous_only: true });
  const list = councils.length
    ? councils
    : (await getCouncils(locale, token)).filter((item) => !item.is_current && !item.current);
  const boards: DummyPreviousBoard[] = [];
  for (const council of list) {
    const board = toPreviousBoard(council, locale);
    if (!board.members.length) {
      const members = await getCouncilMembers(council.id, locale, token);
      const range = dateRange(council, locale);
      board.members = members.map((member) => toBoardMember(member, locale, range));
    }
    boards.push(board);
  }
  return boards;
}

export async function getPreviousBoardById(
  id: string,
  locale: Locale,
  token: string,
): Promise<DummyPreviousBoard | null> {
  try {
    const council = await getCouncil(id, locale, token);
    const board = toPreviousBoard(council, locale);
    if (!board.members.length) {
      const members = await getCouncilMembers(id, locale, token);
      const range = dateRange(council, locale);
      board.members = members.map((member) => toBoardMember(member, locale, range));
    }
    return board;
  } catch {
    return null;
  }
}
