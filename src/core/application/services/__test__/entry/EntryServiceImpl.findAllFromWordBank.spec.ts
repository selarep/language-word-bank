import { Entry } from 'src/core/domain/model/entities/Entry';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { EntryServiceImpl } from '../../EntryServiceImpl';
import { mockEntryRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockEntryRepositoryFactory';
import { mockWordBankRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockWordBankRepositoryFactory';
import { WordBank } from 'src/core/domain/model/entities/WordBank';
import { Id } from 'src/core/shared/domain/valueObjects/Id';
import { InvalidUUIDError } from '../../../errors/invalid-uuid.error';
import { WordBankNotFoundError } from '../../../errors/word-bank-not-found.error';

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

  describe('findAllFromWordBank', () => {
    it('should throw an error if the word bank id is invalid', async () => {
      const wordBankId = 'invalid';

      await expect(
        entryService.findAllFromWordBank(wordBankId),
      ).rejects.toThrow(InvalidUUIDError);
      expect(mockWordBankRepository.findById).not.toHaveBeenCalled();
      expect(mockEntryRepository.findAllFromWordBank).not.toHaveBeenCalled();
    });
    it('should throw an error if the word bank does not exist', async () => {
      const wordBankId = Id.generate().getValue();
      mockWordBankRepository.findById.mockResolvedValue(undefined);

      await expect(
        entryService.findAllFromWordBank(wordBankId),
      ).rejects.toThrow(WordBankNotFoundError);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
      expect(mockEntryRepository.findAllFromWordBank).not.toHaveBeenCalled();
    });
    it('should return all entries from a word bank', async () => {
      const wordBankId = Id.generate().getValue();
      const entries = [
        Entry.create({
          term: 'test',
          pronunciation: 'pronunciation',
        }),
        Entry.create({
          term: 'test2',
          pronunciation: 'pronunciation2',
        }),
      ];
      mockWordBankRepository.findById.mockResolvedValue({} as WordBank);
      mockEntryRepository.findAllFromWordBank.mockResolvedValue(entries);

      const result = await entryService.findAllFromWordBank(wordBankId);

      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
      expect(mockEntryRepository.findAllFromWordBank).toHaveBeenCalledWith(
        wordBankId,
      );
      expect(result).toEqual(entries);
    });
  });
});
