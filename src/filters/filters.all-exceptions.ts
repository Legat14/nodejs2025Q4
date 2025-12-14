import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const { method, url } = context.getRequest();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();

      this.logger.error(
        `Handled HttpException: ${method} ${url}`,
        JSON.stringify(errorResponse),
      );

      return response.status(statusCode).json(errorResponse);
    }

    this.logger.error(
      exception.message,
      exception.stack,
      `Unhandled exception in ${method} ${url}`,
    );

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json({
      statusCode,
      message: 'Internal Server Error',
    });
  }
}
