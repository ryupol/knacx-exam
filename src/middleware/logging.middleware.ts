import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from '../configs/logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const responseTime = Date.now() - start;
      const logMessage = `${method} ${originalUrl} ${responseTime}ms`;
      winstonLogger.info(logMessage); // Use Winston logger
    });

    next();
  }
}
