import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { WordBank } from 'src/core/domain/model/entities/WordBank';
import { mockWordBankRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockWordBankRepositoryFactory';
import { mockEntryRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockEntryRepositoryFactory';
import { WordBankServiceImpl } from '../../WordBankServiceImpl';
import { Id } from 'src/core/shared/domain/valueObjects/Id';
import { InvalidUUIDError } from 'src/core/application/errors/invalid-uuid.error';
import { WordBankNotFoundError } from 'src/core/application/errors/word-bank-not-found.error';
import { DuplicateEntryError } from 'src/core/application/errors/duplicate-entry.error';
import { EntryNotFoundError } from 'src/core/application/errors/entry-not-found.error';
import { Entry } from 'src/core/domain/model/entities/Entry';

describe('WordBankServiceImpl', () => {
  let mockWordBankRepository: jest.MockedObject<WordBankRepository>;
  let mockEntryRepository: jest.MockedObject<EntryRepository>;
  let wordBankService: WordBankService;

  beforeEach(() => {
    mockWordBankRepository = mockWordBankRepositoryFactory();
    mockEntryRepository = mockEntryRepositoryFactory();

    wordBankService = new WordBankServiceImpl(
      mockWordBankRepository,
      mockEntryRepository,
    );
  });

  describe('assignEntryByTerm', () => {
    it('should throw an error if the word bank id is invalid', async () => {
      const wordBankId = 'invalid';
      const term = 'test';

      await expect(
        wordBankService.assignEntryByTerm(wordBankId, term),
      ).rejects.toThrow(InvalidUUIDError);
      expect(mockWordBankRepository.findById).not.toHaveBeenCalled();
    });
    it('should throw an error if the word bank is not found', async () => {
      const wordBankId = Id.generate().getValue();
      const term = 'test';
      mockWordBankRepository.findById.mockResolvedValue(undefined);

      await expect(
        wordBankService.assignEntryByTerm(wordBankId, term),
      ).rejects.toThrow(WordBankNotFoundError);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
    });
    it('should throw an error if the entry is not found', async () => {
      const wordBankId = Id.generate().getValue();
      const term = 'test';
      const wordBank = WordBank.create({
        title: 'test',
        description: 'test',
        entryIds: [],
      });
      mockWordBankRepository.findById.mockResolvedValue(wordBank);
      mockEntryRepository.findByTerm.mockResolvedValue(undefined);

      await expect(
        wordBankService.assignEntryByTerm(wordBankId, term),
      ).rejects.toThrow(EntryNotFoundError);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
      expect(mockEntryRepository.findByTerm).toHaveBeenCalledWith(term);
    });
    it('should throw an error if the entry is already assigned', async () => {
      const wordBankId = Id.generate().getValue();
      const term = 'test';
      const entry = Entry.create({
        term,
        pronunciation: 'pronunciation',
        definitions: [],
      });
      const wordBank = WordBank.create({
        title: 'test',
        description: 'test',
        entryIds: [entry.id.getValue()],
      });
      mockWordBankRepository.findById.mockResolvedValue(wordBank);
      mockEntryRepository.findByTerm.mockResolvedValue(entry);

      await expect(
        wordBankService.assignEntryByTerm(wordBankId, term),
      ).rejects.toThrow(DuplicateEntryError);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
    });
    it('should assign an entry to a word bank', async () => {
      const wordBankId = Id.generate().getValue();
      const term = 'test';
      const wordBank = WordBank.create({
        id: wordBankId,
        title: 'test',
        description: 'test',
        entryIds: [],
      });
      const entry = Entry.create({
        term,
        pronunciation: 'pronunciation',
        definitions: [],
      });
      const updatedWordBank = WordBank.create({
        ...wordBank,
        id: wordBank.id.getValue(),
        entryIds: [entry.id.getValue()],
      });
      mockWordBankRepository.findById.mockResolvedValue(wordBank);
      mockEntryRepository.findByTerm.mockResolvedValue(entry);
      mockWordBankRepository.save.mockResolvedValue(updatedWordBank);

      const result = await wordBankService.assignEntryByTerm(wordBankId, term);
      expect(result).toEqual(updatedWordBank);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
      expect(mockEntryRepository.findByTerm).toHaveBeenCalledWith(term);
      expect(mockWordBankRepository.save).toHaveBeenCalledWith(wordBank);
    });
  });
});
