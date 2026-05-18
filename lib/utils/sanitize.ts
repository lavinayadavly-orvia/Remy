export function sanitizeFilename(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120) || "untitled";
}

export function clampText(value: string, maxChars = 20000): string {
  return value.length > maxChars ? `${value.slice(0, maxChars)}\n\n[Truncated]` : value;
}
