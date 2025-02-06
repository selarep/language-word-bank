import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';

export const mockWordBankRepositoryFactory =
  (): jest.MockedObject<WordBankRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  });
