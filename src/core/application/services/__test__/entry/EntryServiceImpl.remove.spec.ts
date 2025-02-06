import { Entry } from 'src/core/domain/model/entities/Entry';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { EntryServiceImpl } from '../../EntryServiceImpl';
import { mockEntryRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockEntryRepositoryFactory';
import { mockWordBankRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockWordBankRepositoryFactory';
import { Id } from 'src/core/shared/domain/valueObjects/Id';
import { EntryNotFoundError } from '../../../errors/entry-not-found.error';
import { InvalidUUIDError } from '../../../errors/invalid-uuid.error';

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

  describe('remove', () => {
    it('should throw an error if the id is invalid', async () => {
      const id = 'invalid';

      await expect(entryService.remove(id)).rejects.toThrow(InvalidUUIDError);
      expect(mockEntryRepository.findById).not.toHaveBeenCalled();
      expect(mockEntryRepository.remove).not.toHaveBeenCalled();
    });
    it('should throw an error if the entry does not exist', async () => {
      const id = Id.generate().getValue();
      mockEntryRepository.findById.mockResolvedValue(undefined);

      await expect(entryService.remove(id)).rejects.toThrow(EntryNotFoundError);
      expect(mockEntryRepository.findById).toHaveBeenCalledWith(id);
      expect(mockEntryRepository.remove).not.toHaveBeenCalled();
    });
    it('should remove an entry', async () => {
      const id = Id.generate().getValue();
      const entry = Entry.create({
        id: id,
        term: 'test',
        pronunciation: 'pronunciation',
        definitions: [],
      });
      mockEntryRepository.findById.mockResolvedValue(entry);

      await entryService.remove(id);

      expect(mockEntryRepository.findById).toHaveBeenCalledWith(id);
      expect(mockEntryRepository.remove).toHaveBeenCalledWith(id);
    });
  });
});
