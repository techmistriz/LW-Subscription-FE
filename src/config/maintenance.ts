/**
 * Kept server-side so the maintenance switch cannot be changed in the browser.
 */
export function isMaintenanceModeEnabled(): boolean {
  return process.env.MAINTENANCE_MODE?.trim().toLowerCase() === "true";
}
