
export function getString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw.trim()) throw new Error(`${key} is required`);
  return raw.trim();
}

export function getOptionalString(formData: FormData, key: string): string | null {
  const raw = formData.get(key);
  if (typeof raw !== "string") return null;
  const v = raw.trim();
  return v.length ? v : null;
}

export function getBoolean(formData: FormData, key: string): boolean {
  const raw = formData.get(key);
  if (raw === "true" ) return true;
  if (raw === "false") return false;
  throw new Error(`${key} must be "true" or "false"`);
}

export function getDate(formData: FormData, key: string): Date {
  const s = getString(formData, key);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) throw new Error(`${key} is invalid date`);
  return d;
}
