import pinoHttp, { startTime } from "pino-http";
import type { Logger } from "pino";
import { randomUUID } from "crypto";

export function getLoggingMiddleware(logger: Logger) {
  return pinoHttp({
    logger: logger.child({ name: "http" }),
    customSuccessMessage(req, res) {
      const responseTime = Date.now() - res[startTime];
      // @ts-ignore
      return `${res.req.method} ${res.req.url} ${res.statusCode} - ${responseTime}ms`;
    },
    customErrorMessage(err, res) {
      const responseTime = Date.now() - res[startTime];
      // @ts-ignore
      return `${res.req.method} ${res.req.url} ${res.statusCode} - ${responseTime}ms`;
    },
    genReqId: (req) =>
      req.headers["x-request-id"] ||
      req.headers["x-github-delivery"] ||
      randomUUID(),
  });
}
