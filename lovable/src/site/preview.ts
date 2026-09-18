/** Explicit local/review mode. Production submission stays same-origin. */
export const IS_PREVIEW = import.meta.env.DEV || import.meta.env.VITE_PREVIEW === "true";
export async function submitLead(payload: Record<string, unknown>): Promise<void> {
  if (IS_PREVIEW) return;
  const response = await fetch("/api/lead", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(String(response.status));
}
