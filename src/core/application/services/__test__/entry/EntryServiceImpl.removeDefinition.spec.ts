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
import { Definition } from 'src/core/domain/model/entities/Definition';
import { DefinitionNotFoundError } from '../../../errors/definition-not-found.error';

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

  describe('removeDefinition', () => {
    it('should throw an error if the entry id is invalid', async () => {
      const entryId = 'invalid';
      const definitionId = Id.generate().getValue();

      await expect(
        entryService.removeDefinition(entryId, definitionId),
      ).rejects.toThrow(InvalidUUIDError);
      expect(mockEntryRepository.findById).not.toHaveBeenCalled();
      expect(mockEntryRepository.removeDefinition).not.toHaveBeenCalled();
    });
    it('should throw an error if the definition id is invalid', async () => {
      const entryId = Id.generate().getValue();
      const definitionId = 'invalid';

      await expect(
        entryService.removeDefinition(entryId, definitionId),
      ).rejects.toThrow(InvalidUUIDError);
      expect(mockEntryRepository.findById).not.toHaveBeenCalled();
      expect(mockEntryRepository.removeDefinition).not.toHaveBeenCalled();
    });
    it('should throw an error if the entry does not exist', async () => {
      const entryId = Id.generate().getValue();
      const definitionId = Id.generate().getValue();
      mockEntryRepository.findById.mockResolvedValue(undefined);

      await expect(
        entryService.removeDefinition(entryId, definitionId),
      ).rejects.toThrow(EntryNotFoundError);
      expect(mockEntryRepository.findById).toHaveBeenCalledWith(entryId);
      expect(mockEntryRepository.removeDefinition).not.toHaveBeenCalled();
    });
    it('should throw an error if the definition does not exist', async () => {
      const entryId = Id.generate().getValue();
      const definitionId = Id.generate().getValue();
      const entry = Entry.create({
        id: entryId,
        term: 'test',
        pronunciation: 'pronunciation',
        definitions: [],
      });
      mockEntryRepository.findById.mockResolvedValue(entry);

      await expect(
        entryService.removeDefinition(entryId, definitionId),
      ).rejects.toThrow(DefinitionNotFoundError);
      expect(mockEntryRepository.findById).toHaveBeenCalledWith(entryId);
      expect(mockEntryRepository.removeDefinition).not.toHaveBeenCalled();
    });
    it('should remove a definition', async () => {
      const entryId = Id.generate().getValue();
      const definitionId = Id.generate().getValue();
      const entry = Entry.create({
        id: entryId,
        term: 'test',
        pronunciation: 'pronunciation',
        definitions: [
          {
            id: definitionId,
            definitionText: 'Lorem ipsum',
            examples: [],
          },
        ],
      });
      mockEntryRepository.findById.mockResolvedValue(entry);

      const result = await entryService.removeDefinition(entryId, definitionId);

      expect(mockEntryRepository.findById).toHaveBeenCalledWith(entryId);
      expect(mockEntryRepository.removeDefinition).toHaveBeenCalledWith(
        definitionId,
      );
      expect(result).toBeUndefined();
    });
  });
});
