import util from "node:util";
import {
  createLogger as createWinstonLogger,
  transports,
  Logger,
  format,
  addColors
} from "winston";

const customLevels = {
  error: 0,
  warn: 1,
  data: 2,
  info: 3,
  debug: 4,
  verbose: 5,
  silly: 6,
  custom: 7
};

const customColors = {
  error: "red",
  warn: "yellow",
  data: "grey",
  info: "green",
  debug: "red",
  verbose: "cyan",
  silly: "magenta",
  custom: "blue"
};
const customFormatter = ({ level, message, label, timestamp, ...rest }) => {
  // If splat exists, it contains additional arguments passed to the logger
  const splat = rest[Symbol.for('splat')] || [];
  const formattedMessage = [message, ...splat].map((v) => typeof v === 'string' ? v : util.inspect(v, { colors: true, depth: 100 })).join(' ');
  return `${label}|${timestamp}|${level}|${formattedMessage}`;
};


const createLogger = (proc?: string): any => {
  addColors(customColors);
  const logger: any = createWinstonLogger({
    defaultMeta: {
      service: proc || "alkanes"
    },
    levels: customLevels,
    format: format.combine(format.errors({ stack: true }), format.json()),
    transports: [
      new transports.Console({
        level: "verbose",
        format: format.combine(
          format.label({ label: proc }),
          format.timestamp(),
          format.printf(customFormatter as any)
        )
      })
    ]
  });

  return logger;
};

const logger = createLogger(require('../../package').name);

export function getLogger(proc: string): Logger { return createLogger(proc); }
