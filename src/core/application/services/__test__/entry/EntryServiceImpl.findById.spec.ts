import { Entry } from 'src/core/domain/model/entities/Entry';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { EntryServiceImpl } from '../../EntryServiceImpl';
import { mockEntryRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockEntryRepositoryFactory';
import { mockWordBankRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockWordBankRepositoryFactory';
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

  describe('findById', () => {
    it('should throw an error if the id is invalid', async () => {
      const id = 'invalid';

      await expect(entryService.findById(id)).rejects.toThrow(InvalidUUIDError);
      expect(mockEntryRepository.findById).not.toHaveBeenCalled();
    });
    it('should return an entry by id', async () => {
      const entry = Entry.create({
        term: 'test',
        pronunciation: 'pronunciation',
      });
      const id = entry.id.getValue();
      mockEntryRepository.findById.mockResolvedValue(entry);

      const result = await entryService.findById(id);

      expect(mockEntryRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(entry);
    });
  });
});
