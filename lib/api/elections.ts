import { apiGet, apiGetPage, apiPost, apiPostForm, type ApiQuery } from "@/lib/api/client";
import { asList } from "@/lib/api/catalog";
import { pairLocalized, pickLocalized, resolveMedia } from "@/lib/api/localized";
import type { Locale } from "@/lib/i18n/config";
import type {
  ElectionCandidate,
  ElectionPhase,
  ElectionRoleId,
} from "@/lib/dashboard/dummy-elections";

type ApiElection = {
  id: number;
  title?: string | null;
  title_ar?: string | null;
  title_en?: string | null;
  status?: string | null;
  phase?: string | null;
  type?: string | null;
  election_type?: string | null;
  nomination_end_at?: string | null;
  voting_end_at?: string | null;
  end_date?: string | null;
  can_nominate?: boolean;
  can_vote?: boolean;
};

type ApiCandidate = {
  id: number;
  name?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  position?: string | null;
  position_ar?: string | null;
  position_en?: string | null;
  bio?: string | null;
  bio_ar?: string | null;
  bio_en?: string | null;
  manifesto?: string | null;
  manifesto_ar?: string | null;
  manifesto_en?: string | null;
  image?: string | null;
  image_url?: string | null;
  vote_percent?: number | null;
  vote_percentage?: number | null;
  votes_count?: number | null;
  vote_count?: number | null;
  files?: { id?: number; name?: string; url?: string }[];
};

export type ElectionView = {
  id: number;
  title: string;
  phase: ElectionPhase;
  deadline: Date | null;
  canNominate: boolean;
  canVote: boolean;
  stats: { president: number; vicePresident: number; member: number };
};

function roleFromPosition(value?: string | null): ElectionRoleId {
  const raw = (value || "").toLowerCase();
  if (raw.includes("vice") || raw.includes("نائب")) return "vice_president";
  if (raw.includes("president") || raw.includes("رئيس")) return "president";
  return "member";
}

function roleLabel(role: ElectionRoleId, locale: Locale): string {
  if (role === "president") return locale === "ar" ? "رئيس مجلس الإدارة" : "Board president";
  if (role === "vice_president") return locale === "ar" ? "نائب الرئيس" : "Vice president";
  return locale === "ar" ? "عضو" : "Member";
}

export function toElectionCandidate(item: ApiCandidate, locale: Locale): ElectionCandidate {
  const roleId = roleFromPosition(item.position_ar || item.position || item.position_en);
  const name = pairLocalized(item.name_ar, item.name_en || item.name);
  const bio = pairLocalized(
    item.bio_ar || item.manifesto_ar,
    item.bio_en || item.manifesto_en || item.bio || item.manifesto,
  );
  return {
    id: String(item.id),
    roleId,
    name: name.ar,
    nameEn: name.en,
    role: roleLabel(roleId, locale),
    roleEn: roleLabel(roleId, "en"),
    image: resolveMedia(item.image_url || item.image),
    showMedal: roleId === "president",
    votePercent: Number(item.vote_percent ?? item.vote_percentage ?? 0),
    voteCount: Number(item.votes_count ?? item.vote_count ?? 0),
    bio: bio.ar,
    bioEn: bio.en,
    files: (item.files ?? []).map((file, index) => ({
      id: String(file.id ?? index),
      name: file.name || (locale === "ar" ? "ملف" : "File"),
      nameEn: file.name || "File",
      kind: (file.name || "").toLowerCase().includes("doc") ? "docx" : "pdf",
    })),
  };
}

function electionPhase(item: ApiElection): ElectionPhase {
  const raw = `${item.phase || ""} ${item.status || ""}`.toLowerCase();
  if (raw.includes("nomin") || raw.includes("ترش")) return "nominate";
  return "vote";
}

export async function getElections(locale: Locale, token: string, query?: ApiQuery) {
  const page = await apiGetPage<ApiElection[]>("/elections", locale, token, query);
  return asList<ApiElection>(page.data);
}

export async function getActiveElection(
  locale: Locale,
  token: string,
): Promise<ElectionView | null> {
  const elections = await getElections(locale, token);
  const current = elections[0];
  if (!current) return null;
  let stats = { president: 0, vicePresident: 0, member: 0 };
  try {
    const counts = await apiGet<Record<string, number>>(
      `/elections/${current.id}/candidate-counts`,
      locale,
      token,
    );
    stats = {
      president: Number(counts.president ?? counts.رئيس ?? 0),
      vicePresident: Number(counts.vice_president ?? counts.vicePresident ?? 0),
      member: Number(counts.member ?? counts.members ?? 0),
    };
  } catch {
    // Counts are optional for the vote phase.
  }
  const deadlineRaw = current.voting_end_at || current.nomination_end_at || current.end_date;
  return {
    id: current.id,
    title: pickLocalized(locale, current.title_ar, current.title_en, current.title || ""),
    phase: electionPhase(current),
    deadline: deadlineRaw ? new Date(deadlineRaw) : null,
    canNominate: Boolean(current.can_nominate),
    canVote: Boolean(current.can_vote),
    stats,
  };
}

export async function getElectionCandidates(
  electionId: string | number,
  locale: Locale,
  token: string,
) {
  const data = await apiGet<ApiCandidate[]>(
    `/elections/${electionId}/candidates`,
    locale,
    token,
  );
  return asList<ApiCandidate>(data).map((item) => toElectionCandidate(item, locale));
}

export async function getElectionTerms(locale: Locale, token: string) {
  try {
    const data = await apiGet<{ content?: string; text?: string; terms?: string }>(
      "/elections-terms-and-conditions",
      locale,
      token,
    );
    return data.content || data.text || data.terms || "";
  } catch {
    return "";
  }
}

export async function nominateCandidate(
  payload: {
    election_id: number;
    position: string;
    bio: string;
    image?: File | null;
    files?: File[];
  },
  locale: Locale,
  token: string,
) {
  const body = new FormData();
  body.append("election_id", String(payload.election_id));
  body.append("position", payload.position);
  body.append("bio", payload.bio);
  if (payload.image) body.append("image", payload.image);
  payload.files?.forEach((file, index) => body.append(`files[${index}]`, file));
  return apiPostForm("/elections/candidates", body, locale, token);
}

export async function castVote(
  payload: { election_id: number; candidate_id: number; position: string },
  locale: Locale,
  token: string,
) {
  return apiPost("/elections/votes", payload, locale, token);
}

export async function canVote(
  electionId: string | number,
  position: string,
  locale: Locale,
  token: string,
) {
  try {
    const data = await apiGet<{ can_vote?: boolean }>(
      `/elections/${electionId}/can-vote/${position}`,
      locale,
      token,
    );
    return Boolean(data.can_vote);
  } catch {
    return false;
  }
}
