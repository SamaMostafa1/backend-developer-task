import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    const message = this.getMessage(exceptionResponse);

    const isValidationError =
      statusCode === HttpStatus.BAD_REQUEST &&
      message.includes('Request validation');

    response.status(statusCode).json({
      success: false,
      statusCode,
      message: {
        message: isValidationError ? 'Validation failed' : message,
        details: isValidationError ? this.getValidationDetails(message) : null,
      },
    });
  }

  private getMessage(exceptionResponse: unknown): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const message = exceptionResponse.message;

      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return 'Internal server error';
  }

  private getValidationDetails(message: string): string[] {
  const [, errors = message] = message.split('because:');

  return errors
    .split(',')
    .map((error) => error.trim().replace(/"/g, ''))
    .filter(Boolean);
}

}