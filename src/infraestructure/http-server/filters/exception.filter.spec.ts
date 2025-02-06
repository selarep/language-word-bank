import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './exception.filter';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DefinitionNotFoundError } from 'src/core/application/errors/definition-not-found.error';
import { DuplicateEntryError } from 'src/core/application/errors/duplicate-entry.error';
import { EntryNotFoundError } from 'src/core/application/errors/entry-not-found.error';
import { InvalidUUIDError } from 'src/core/application/errors/invalid-uuid.error';
import { WordBankNotFoundError } from 'src/core/application/errors/word-bank-not-found.error';
import { Id } from 'src/core/shared/domain/valueObjects/Id';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: Partial<ArgumentsHost>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    };
  });

  it('should return 404 for EntryNotFoundError', () => {
    const id = Id.generate().getValue();
    const exception = new EntryNotFoundError(id);
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: `Entry with ID '${id}' not found.`,
    });
  });

  it('should return 404 for WordBankNotFoundError', () => {
    const id = Id.generate().getValue();
    const exception = new WordBankNotFoundError(id);
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: `WordBank with ID '${id}' not found.`,
    });
  });

  it('should return 404 for DefinitionNotFoundError', () => {
    const id = Id.generate().getValue();
    const exception = new DefinitionNotFoundError(id);
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: `Definition with ID '${id}' not found.`,
    });
  });

  it('should return 400 for InvalidUUIDError', () => {
    const id = 'asdf';
    const exception = new InvalidUUIDError(id);
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: `ID '${id}' is not a valid UUID v4.`,
    });
  });

  it('should return 409 for DuplicateEntryError', () => {
    const term = 'cat';
    const exception = new DuplicateEntryError(term);
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: `Entry with term '${term}' exists.`,
    });
  });

  it('should return 500 for generic errors', () => {
    const exception = new Error('Generic error');
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  });
});
