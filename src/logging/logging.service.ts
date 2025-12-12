import { Injectable, Logger } from '@nestjs/common';
import {
  createWriteStream,
  statSync,
  renameSync,
  existsSync,
  mkdirSync,
} from 'node:fs';
import { join } from 'node:path';

const KB_IN_MB = 1024;

enum LOG_LEVELS {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

enum LOG_LEVEL_COLORS {
  ERROR = '\x1b[31;1m',
  WARN = '\x1b[33;1m',
  LOG = '\x1b[36;1m',
  DEBUG = '\x1b[35;1m',
  VERBOSE = '\x1b[34;1m',
}

@Injectable()
export class LoggingService {
  logger = new Logger('App');
  logLevel = process.env.LOG_LEVEL || 'info';
  maxFileSizeKb = Number(process.env.LOG_FILE_MAX_SIZE_KB || 1024);
  logFilePath = join(process.cwd(), 'logs/rest-service-log.log');
  errorFilePath = join(process.cwd(), 'logs/rest-service-error.log');

  constructor() {
    if (!existsSync('logs')) {
      mkdirSync('logs');
    }
  }

  shouldLog(level: string) {
    const order = ['error', 'warn', 'log', 'debug', 'verbose'];

    return order.indexOf(level) <= order.indexOf(this.logLevel);
  }

  rotateFile(path: string) {
    try {
      if (!existsSync(path)) return;

      const { size } = statSync(path);
      if (size / KB_IN_MB >= this.maxFileSizeKb) {
        const rotatedPath = path.replace('.log', `-${Date.now()}.log`);
        renameSync(path, rotatedPath);
      }
    } catch {}
  }

  writeToFile(path: string, message: string) {
    this.rotateFile(path);
    const stream = createWriteStream(path, { flags: 'a' });
    stream.write(message + '\n');
    stream.end();
  }

  log(message: string, context?: string) {
    if (this.shouldLog(LOG_LEVELS.LOG)) {
      const record = `${LOG_LEVEL_COLORS.LOG}[${LOG_LEVELS.LOG.toUpperCase()}]\x1b[0m ${context ?? ''} ${message}`;
      this.logger.log(record);
      this.writeToFile(this.logFilePath, record);
    }
  }

  error(message: string, trace?: string, context?: string) {
    const record = `${LOG_LEVEL_COLORS.ERROR}[${LOG_LEVELS.ERROR.toUpperCase()}]\x1b[0m ${context ?? ''} ${message}\n${trace ?? ''}`;
    this.logger.error(record);
    this.writeToFile(this.errorFilePath, record);

    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      this.writeToFile(this.logFilePath, record);
    }
  }

  warn(message: string, context?: string) {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      const record = `${LOG_LEVEL_COLORS.WARN}[${LOG_LEVELS.WARN.toUpperCase()}]\x1b[0m ${context ?? ''} ${message}`;
      this.logger.warn(record);
      this.writeToFile(this.logFilePath, record);
    }
  }

  debug(message: string, context?: string) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      const record = `${LOG_LEVEL_COLORS.DEBUG}[${LOG_LEVELS.DEBUG.toUpperCase()}]\x1b[0m ${context ?? ''} ${message}`;
      this.logger.debug(record);
      this.writeToFile(this.logFilePath, record);
    }
  }

  verbose(message: string, context?: string) {
    if (this.shouldLog(LOG_LEVELS.VERBOSE)) {
      const record = `${LOG_LEVEL_COLORS.VERBOSE}[${LOG_LEVELS.VERBOSE.toUpperCase()}]\x1b[0m ${context ?? ''} ${message}`;
      this.logger.verbose(record);
      this.writeToFile(this.logFilePath, record);
    }
  }
}
