import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { DefinitionNotFoundError } from 'src/core/application/errors/definition-not-found.error';
import { DuplicateEntryError } from 'src/core/application/errors/duplicate-entry.error';
import { EntryNotFoundError } from 'src/core/application/errors/entry-not-found.error';
import { InvalidUUIDError } from 'src/core/application/errors/invalid-uuid.error';
import { WordBankNotFoundError } from 'src/core/application/errors/word-bank-not-found.error';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      const response = exception.getResponse();
      message =
        typeof response === 'object' && 'message' in response
          ? (response.message as string[])
          : exception.message;
    } else if (
      exception instanceof EntryNotFoundError ||
      exception instanceof WordBankNotFoundError ||
      exception instanceof DefinitionNotFoundError
    ) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof InvalidUUIDError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof DuplicateEntryError) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    response.status(status).json({ statusCode: status, message });
  }
}
