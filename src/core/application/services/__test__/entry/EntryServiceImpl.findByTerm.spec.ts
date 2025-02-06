import { Entry } from 'src/core/domain/model/entities/Entry';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { EntryServiceImpl } from '../../EntryServiceImpl';
import { mockEntryRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockEntryRepositoryFactory';
import { mockWordBankRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockWordBankRepositoryFactory';

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

  describe('findByTerm', () => {
    it('should return an entry by term', async () => {
      const entry = Entry.create({
        term: 'test',
        pronunciation: 'pronunciation',
      });
      mockEntryRepository.findByTerm.mockResolvedValue(entry);

      const result = await entryService.findByTerm(entry.term);

      expect(mockEntryRepository.findByTerm).toHaveBeenCalledWith(entry.term);
      expect(result).toEqual(entry);
    });
    it('should return undefined if the entry does not exist', async () => {
      mockEntryRepository.findByTerm.mockResolvedValue(undefined);

      const result = await entryService.findByTerm('test');

      expect(mockEntryRepository.findByTerm).toHaveBeenCalledWith('test');
      expect(result).toBeUndefined();
    });
  });
});
