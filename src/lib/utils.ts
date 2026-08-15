export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Short, human label for a machine: "FX-72S3 — Computerized Intarsia…" */
export function productLabel(p: { model: string | null; name: string }): string {
  return p.model ? `${p.model} — ${p.name}` : p.name;
}

export function whatsappLink(e164: string, message: string): string {
  return `https://wa.me/${e164}?text=${encodeURIComponent(message)}`;
}

/** Trim to `max` characters on a word boundary, for meta descriptions. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const at = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(' '));
  return `${cut.slice(0, at > max * 0.5 ? at : max).replace(/[,;:.\s]+$/, '')}…`;
}
