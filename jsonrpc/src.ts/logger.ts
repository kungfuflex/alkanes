import {
  createLogger as createWinstonLogger,
  transports,
  format,
  addColors,
} from "winston";

const customLevels = {
  error: 0,
  warn: 1,
  data: 2,
  info: 3,
  debug: 4,
  verbose: 5,
  silly: 6,
  custom: 7,
};

const customColors = {
  error: "red",
  warn: "yellow",
  data: "grey",
  info: "green",
  debug: "red",
  verbose: "cyan",
  silly: "magenta",
  custom: "blue",
};

/*
const customFormatter = ({ level, message, label, timestamp }: any): string => {
  return `${label}|${timestamp}|${level}|${
    typeof message === "string"
      ? message
      : util.inspect(message, { colors: true, depth: 15 })
  }`;
};
*/

const createLogger = (proc?: string): ReturnType<typeof createWinstonLogger> => {
  addColors(customColors);
  const logger = createWinstonLogger({
    defaultMeta: {
      service: proc || "alkanes-rpc",
    },
    levels: customLevels,
    format: format.combine(format.errors({ stack: true }), format.json()),
    transports: [
      new transports.Console({
        level: "verbose",
        format: format.combine(
          format.label({ label: proc }),
          format.timestamp(),
          //format.printf(customFormatter),
        ),
      }),
    ],
  });

  return logger;
};

const logger = createLogger(require("../package").name);

export function getLogger() {
  return logger;
}
