// @ts-nocheck

const { streamSym, writeSym } = require('pino/lib/symbols');
import type { Logger } from "pino";
import {Transform} from "stream";

export async function captureLogOutput(action: () => any, log: Logger): Promise<string> {
  let outputData = "";

  let originalWrite = (log[streamSym] as Transform)._write;
  (log[streamSym] as Transform)._write = (chunk: any, encoding: any, callback: any) => {
    outputData += chunk.toString();
    callback && callback();
    return true;
  };

  try {
    await action();

    return outputData;
  } finally {
    (log[streamSym] as Transform)._write = originalWrite;
  }
}
