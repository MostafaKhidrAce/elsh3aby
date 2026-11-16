const OCCASION =
  /ملتقى|حفل|اجتماع|فعالية|يوم|مناسبة|forum|ceremony|national|meeting|celebration|gathering/i;

export function normalizeLabel(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isShortLine(value: string): boolean {
  const text = value.trim();
  return text.length > 0 && text.length <= 120 && !/[\r\n]/.test(text);
}

export function samePersonName(left: string, right: string): boolean {
  const a = normalizeLabel(left);
  const b = normalizeLabel(right);
  return a.length > 0 && a === b;
}

/** Homepage cards sometimes store the booker in the title and the occasion in the description. */
export function swapOccasionTitle(
  title: string,
  description: string,
): { title: string; description: string } {
  const heading = title.trim();
  const body = description.trim();
  if (!isShortLine(body)) return { title: heading, description: body };
  if (OCCASION.test(heading) || !OCCASION.test(body)) {
    return { title: heading, description: body };
  }
  return { title: body, description: heading };
}
