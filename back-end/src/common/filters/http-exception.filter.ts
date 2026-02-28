import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

const DOMAIN_EXCEPTION_MAP = new Map<string, number>([
  ['InvalidCredentialsException', HttpStatus.UNAUTHORIZED],
  ['UserNotFoundException', HttpStatus.NOT_FOUND],
  ['AuthAlreadyExistsException', HttpStatus.BAD_REQUEST],
]);

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message = 'An unexpected error occurred';

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const errMsg = (exceptionResponse as Record<string, unknown>)[
          'message'
        ];
        message = Array.isArray(errMsg) ? errMsg[0] : String(errMsg);
      }

      return response.status(status).json({ message });
    }

    if (exception instanceof Error) {
      const mappedStatus = DOMAIN_EXCEPTION_MAP.get(exception.name);

      if (mappedStatus !== undefined) {
        return response.status(mappedStatus).json({
          message: exception.message,
        });
      }

      console.error('[ExceptionsFilter] Unhandled domain error:', exception);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }

    console.error('[ExceptionsFilter] Unknown exception:', exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
    });
  }
}
