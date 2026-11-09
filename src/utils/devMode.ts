/**
 * Developer tooling flag.
 * By default in production, dev tooling (reference desk triggers, audio chips, etc.) is OFF.
 * Can be explicitly enabled via URL param `?dev=1` or `VITE_DEV_TOOLS=true`.
 */
export function isDevMode(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('dev') === '1') return true;
    return Boolean(import.meta.env && import.meta.env.VITE_DEV_TOOLS === 'true');
  } catch {
    return false;
  }
}
