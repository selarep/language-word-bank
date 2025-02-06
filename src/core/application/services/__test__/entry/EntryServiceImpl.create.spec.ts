import { Entry } from 'src/core/domain/model/entities/Entry';
import { NewEntryDTO } from 'src/core/shared/dto/NewEntryDTO';
import { DuplicateEntryError } from '../../../errors/duplicate-entry.error';
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

  describe('create', () => {
    it('should throw an error if the entry already exists', async () => {
      const newEntryDto: NewEntryDTO = {
        term: 'test',
        pronunciation: 'pronunciation',
      };

      const entry = Entry.create(newEntryDto);

      mockEntryRepository.findByTerm.mockResolvedValue(entry);

      await expect(entryService.create(newEntryDto)).rejects.toThrow(
        DuplicateEntryError,
      );
      expect(mockEntryRepository.findByTerm).toHaveBeenCalledWith(
        newEntryDto.term,
      );
      expect(mockEntryRepository.save).not.toHaveBeenCalled();
    });
    it('should create a new entry', async () => {
      const newEntryDto: NewEntryDTO = {
        term: 'test',
        pronunciation: 'pronunciation',
      };

      mockEntryRepository.findByTerm.mockResolvedValue(undefined);
      mockEntryRepository.save.mockImplementation(
        (entry) => new Promise((resolve) => resolve(entry)),
      );

      const result = await entryService.create(newEntryDto);

      expect(mockEntryRepository.findByTerm).toHaveBeenCalledWith(
        newEntryDto.term,
      );
      expect(mockEntryRepository.save).toHaveBeenCalledWith(result);
      expect(result).toEqual(
        Entry.create({
          ...newEntryDto,
          id: result.id.getValue(),
        }),
      );
    });
  });
});
