import { apiGet, apiGetPage, type ApiQuery } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import { pairLocalized, pairNamed, resolveMedia } from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";
import type {
  DummyBoardMember,
  DummyPreviousBoard,
  MemberRoleKind,
} from "@/lib/dashboard/dummy-members";

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

type ApiCouncilUser = {
  id?: number;
  name?: string | null;
  full_name?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  image?: string | null;
};

type ApiCouncilMember = {
  id: number;
  council_id?: number | null;
  user_id?: number | null;
  name?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  role?: string | null;
  role_label?: string | null;
  position?: string | null;
  position_label?: string | null;
  position_ar?: string | null;
  position_en?: string | null;
  title?: string | null;
  display_title?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  biography?: string | null;
  bio?: string | null;
  bio_ar?: string | null;
  profile_image_url?: string | null;
  image?: string | null;
  image_url?: string | null;
  vote_percentage?: number | null;
  vote_percent?: number | null;
  total_votes?: number | null;
  vote_count?: number | null;
  votes_count?: number | null;
  is_winner?: boolean;
  user?: ApiCouncilUser | null;
};

function roleKind(value?: string | null): MemberRoleKind {
  const raw = (value || "").toLowerCase();
  if (raw.includes("vice") || raw.includes("نائب")) return "vice_president";
  if ((raw.includes("president") || raw.includes("رئيس")) && !raw.includes("لجن")) {
    return "president";
  }
  if (raw.includes("committee") || raw.includes("لجن")) return "committee_head";
  return "member";
}

function formatRange(from?: string | null, to?: string | null): string {
  const start = (from || "").slice(0, 10);
  const end = (to || "").slice(0, 10);
  return [start, end].filter(Boolean).join(" - ");
}

function dateRange(item: ApiCouncil): { ar: string; en: string } {
  const label = formatRange(
    item.start_date || item.date_from,
    item.end_date || item.date_to,
  );
  return { ar: label, en: label };
}

function formatTitle(value?: string | null) {
  return (value || "").replace(/\s{2,}/g, "\n").trim();
}

export function toBoardMember(
  item: ApiCouncilMember,
  _locale: Locale,
  range: { ar: string; en: string },
): DummyBoardMember {
  const personName =
    item.user?.name ||
    item.user?.full_name ||
    item.name ||
    item.name_ar ||
    item.name_en ||
    "";
  const name = pairLocalized(
    item.user?.name_ar || item.name_ar || personName,
    item.user?.name_en || item.name_en || personName,
  );
  const roleText = formatTitle(
    item.display_title ||
      item.title ||
      item.role_label ||
      item.position_label ||
      item.position_ar ||
      item.role ||
      item.position ||
      "",
  );
  const kind = roleKind(`${item.role || ""} ${roleText}`);
  const bio = pairLocalized(item.bio_ar || item.biography, item.bio || item.biography);
  const memberRange = formatRange(item.start_date, item.end_date);
  return {
    id: String(item.id),
    name: name.ar,
    nameEn: name.en,
    role: roleText,
    roleEn: roleText,
    roleKind: kind,
    image: resolveMedia(
      item.profile_image_url || item.image_url || item.image || item.user?.image,
    ),
    dateRange: memberRange || range.ar,
    dateRangeEn: memberRange || range.en,
    votePercent: item.vote_percent ?? item.vote_percentage ?? undefined,
    voteCount: item.total_votes ?? item.vote_count ?? item.votes_count ?? undefined,
    showMedal: kind === "president",
    bio: bio.ar,
    bioEn: bio.en,
  };
}

export function toPreviousBoard(item: ApiCouncil, locale: Locale): DummyPreviousBoard {
  const range = dateRange(item);
  const title = pairNamed({
    name_ar: item.name_ar || item.title_ar,
    name_en: item.name_en || item.title_en,
    name: item.name || item.title,
  });
  return {
    id: String(item.id),
    title: title.ar,
    titleEn: title.en,
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
  query?: ApiQuery,
) {
  const data = await apiGet<ApiCouncilMember[]>(
    `/councils/${id}/members`,
    locale,
    token,
    { filter: "winner", ...query },
  );
  return asList<ApiCouncilMember>(data).filter(
    (item) =>
      Boolean(
        item.user?.name ||
          item.user?.full_name ||
          item.display_title ||
          item.title ||
          item.name,
      ) && item.name !== "election_candidates",
  );
}

export async function getCurrentBoard(locale: Locale, token: string) {
  const councils = await getCouncils(locale, token, { current_only: true });
  const current =
    councils.find((item) => item.is_current || item.current) ??
    councils[0] ??
    (await getCouncils(locale, token))[0];
  if (!current) return { council: null, members: [] as DummyBoardMember[] };
  const range = dateRange(current);
  const members = await getCouncilMembers(current.id, locale, token);
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
      const range = dateRange(council);
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
      const range = dateRange(council);
      board.members = members.map((member) => toBoardMember(member, locale, range));
    }
    return board;
  } catch {
    return null;
  }
}
