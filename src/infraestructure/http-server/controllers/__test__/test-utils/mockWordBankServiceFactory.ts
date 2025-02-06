import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';

export const mockWordBankServiceFactory =
  (): jest.MockedObject<WordBankService> => ({
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    assignEntry: jest.fn(),
    assignEntryByTerm: jest.fn(),
    unassignEntry: jest.fn(),
    updateWordBank: jest.fn(),
    remove: jest.fn(),
  });
