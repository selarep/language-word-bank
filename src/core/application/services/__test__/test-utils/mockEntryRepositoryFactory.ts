import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';

export const mockEntryRepositoryFactory =
  (): jest.MockedObject<EntryRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByTerm: jest.fn(),
    findAllFromWordBank: jest.fn(),
    addDefinition: jest.fn(),
    removeDefinition: jest.fn(),
    remove: jest.fn(),
    updateDefinition: jest.fn(),
  });
