import process from "node:process";
import type { LoggerOptions } from "pino";
import { pino } from "pino";

/**
 * You can modify Logger traits in here.
 * Check documentation on https://getpino.io/
 */
const PinoTraits: LoggerOptions = {
    formatters: {
        level: (label: string) => ({ level: label.toUpperCase() })
    }
};

// Colorize print if in Development
if (process.env.NODE_ENV !== "production") {
    PinoTraits.transport = {
        target: "pino-pretty",
        options: {
            colorize: true
        }
    };
}

export default pino(PinoTraits);
