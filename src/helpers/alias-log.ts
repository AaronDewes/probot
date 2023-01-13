import type { LogFn, Logger } from "pino";

export type DeprecatedLogger = LogFn & Logger;

/**
 * `probot.log()`, `app.log()` and `context.log()` are aliasing `.log.info()`.
 * We will probably remove the aliasing in future.
 */
export function aliasLog(log: Logger): DeprecatedLogger {
  function logInfo() {
    // @ts-ignore
    log.info(...arguments);
  }

  for (const key in log) {
    // @ts-expect-error
    logInfo[key] =
    // @ts-expect-error
      typeof log[key] === "function" ? log[key].bind(log) : log[key];
  }

  // @ts-ignore
  return logInfo;
}
