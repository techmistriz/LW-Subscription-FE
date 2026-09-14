/**
 * Single entry point for console output.
 *
 * Verbose levels (debug/log/info/warn/table) are on in development and off in
 * production, so day-to-day debugging never reaches a visitor's console.
 * `NEXT_PUBLIC_ENABLE_LOGS` overrides that either way, which is how you turn
 * logging on temporarily in a deployed build.
 *
 * `error` always prints: when someone reports a bug, the browser console is
 * usually the only evidence there is. Move it behind `VERBOSE` below if you
 * would rather production stayed completely silent.
 *
 * Both env reads are written out in full because Next.js inlines
 * `process.env.NEXT_PUBLIC_*` at build time by literal text match — destructure
 * them and the replacement silently does not happen.
 */
const VERBOSE = resolveVerbose();

function resolveVerbose(): boolean {
  const flag = process.env.NEXT_PUBLIC_ENABLE_LOGS?.trim().toLowerCase();

  if (flag === "true") return true;
  if (flag === "false") return false;

  return process.env.NODE_ENV !== "production";
}

export const logger = {
  debug(...args: unknown[]): void {
    if (VERBOSE) console.debug(...args);
  },

  log(...args: unknown[]): void {
    if (VERBOSE) console.log(...args);
  },

  info(...args: unknown[]): void {
    if (VERBOSE) console.info(...args);
  },

  warn(...args: unknown[]): void {
    if (VERBOSE) console.warn(...args);
  },

  table(data: unknown, columns?: string[]): void {
    if (VERBOSE) console.table(data, columns);
  },

  error(...args: unknown[]): void {
    console.error(...args);
  },

  /** True when verbose levels are printing — for guarding expensive debug work. */
  get enabled(): boolean {
    return VERBOSE;
  },
};
