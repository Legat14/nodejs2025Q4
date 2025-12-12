import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    this.logger.log(
      `Incoming request: ${method} ${originalUrl}, query=${JSON.stringify(query)}, body=${JSON.stringify(body)}`,
      'HTTP',
    );

    if (method === 'DELETE') {
      this.logger.warn(`DELETE request made to ${originalUrl}`, 'HTTP');
    }

    this.logger.debug(`Headers: ${JSON.stringify(req.headers)}`, 'HTTP');

    const prevSend = res.send;
    const start = Date.now();

    res.send = (...args: any[]) => {
      const duration = Date.now() - start;
      this.logger.log(
        `Response: ${method} ${originalUrl}, status=${res.statusCode}`,
        'HTTP',
      );
      this.logger.verbose(`Request processed in ${duration}ms`, 'HTTP');

      return prevSend.apply(res, args);
    };

    next();
  }
}
