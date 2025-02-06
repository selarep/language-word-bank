import { Entry } from 'src/core/domain/model/entities/Entry';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { EntryServiceImpl } from '../../EntryServiceImpl';
import { mockEntryRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockEntryRepositoryFactory';
import { mockWordBankRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockWordBankRepositoryFactory';
import { InvalidUUIDError } from '../../../errors/invalid-uuid.error';
import { Id } from 'src/core/shared/domain/valueObjects/Id';
import { EntryNotFoundError } from '../../../errors/entry-not-found.error';

describe('EntryServiceImpl', () => {
  let mockWordBankRepository: jest.MockedObject<WordBankRepository>;
  let mockEntryRepository: jest.MockedObject<EntryRepository>;
  let entryService: EntryService;

  beforeEach(() => {
    mockEntryRepository = mockEntryRepositoryFactory();
    mockWordBankRepository = mockWordBankRepositoryFactory();
    entryService = new EntryServiceImpl(
      mockEntryRepository,
      mockWordBankRepository,
    );
  });

  describe('addDefinition', () => {
    it('should throw an error if the entry id is invalid', async () => {
      const entryId = 'invalid';
      const definition = {
        definitionText: 'Lorem ipsum',
        examples: [],
      };

      await expect(
        entryService.addDefinition(entryId, definition),
      ).rejects.toThrow(InvalidUUIDError);
      expect(mockEntryRepository.findById).not.toHaveBeenCalled();
      expect(mockEntryRepository.addDefinition).not.toHaveBeenCalled();
    });
    it('should throw an error if the entry does not exist', async () => {
      const entryId = Id.generate().getValue();
      const definition = {
        definitionText: 'Lorem ipsum',
        examples: [],
      };
      mockEntryRepository.findById.mockResolvedValue(undefined);

      await expect(
        entryService.addDefinition(entryId, definition),
      ).rejects.toThrow(EntryNotFoundError);
      expect(mockEntryRepository.findById).toHaveBeenCalledWith(entryId);
      expect(mockEntryRepository.addDefinition).not.toHaveBeenCalled();
    });
    it('should add a definition to an entry', async () => {
      const entryId = Id.generate().getValue();
      const definition = {
        definitionText: 'Lorem ipsum',
        examples: [],
      };
      const entry = Entry.create({
        id: entryId,
        term: 'test',
        pronunciation: 'pronunciation',
        definitions: [],
      });
      mockEntryRepository.findById.mockResolvedValue(entry);
      mockEntryRepository.addDefinition.mockImplementation(
        (entryId, definition) => new Promise((resolve) => resolve(definition)),
      );

      const result = await entryService.addDefinition(entryId, definition);

      expect(mockEntryRepository.findById).toHaveBeenCalledWith(entryId);
      expect(mockEntryRepository.addDefinition).toHaveBeenCalledWith(
        entryId,
        result,
      );
    });
  });
});
