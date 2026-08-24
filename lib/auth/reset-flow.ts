const RESET_KEY = "elsh3aby_password_reset";

export type PasswordResetState = {
  phone: string;
  national_id: string;
};

export function savePasswordResetState(state: PasswordResetState): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RESET_KEY, JSON.stringify(state));
}

export function loadPasswordResetState(): PasswordResetState | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(RESET_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PasswordResetState;
    if (parsed.phone && parsed.national_id) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function clearPasswordResetState(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RESET_KEY);
}

export function fromQueryPasswordResetState(
  phone?: string | null,
  nationalId?: string | null,
): PasswordResetState | null {
  if (phone && nationalId) {
    return { phone, national_id: nationalId };
  }
  return null;
}
