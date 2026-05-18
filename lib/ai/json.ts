export function parseJsonObject<T>(value: string): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model response did not contain a JSON object.");
    try {
      return JSON.parse(match[0]) as T;
    } catch {
      throw new Error("Model response contained invalid JSON.");
    }
  }
}
