import { EntryService } from 'src/core/domain/ports/inbound/EntryService';

export const mockEntryServiceFactory = (): jest.MockedObject<EntryService> => ({
  findByTerm: jest.fn(),
  findAllFromWordBank: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  getDefinition: jest.fn(),
  addDefinition: jest.fn(),
  updateDefinition: jest.fn(),
  removeDefinition: jest.fn(),
  remove: jest.fn(),
});
