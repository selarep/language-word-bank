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

  describe('assignEntry', () => {
    it('should throw an error if the word bank id is invalid', async () => {
      const wordBankId = 'invalid';
      const entryId = Id.generate().getValue();

      await expect(
        wordBankService.assignEntry(wordBankId, entryId),
      ).rejects.toThrow(InvalidUUIDError);
      expect(mockWordBankRepository.findById).not.toHaveBeenCalled();
    });
    it('should throw an error if the entry id is invalid', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = 'invalid';

      await expect(
        wordBankService.assignEntry(wordBankId, entryId),
      ).rejects.toThrow(InvalidUUIDError);
      expect(mockWordBankRepository.findById).not.toHaveBeenCalled();
    });
    it('should throw an error if the word bank is not found', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = Id.generate().getValue();
      mockWordBankRepository.findById.mockResolvedValue(undefined);

      await expect(
        wordBankService.assignEntry(wordBankId, entryId),
      ).rejects.toThrow(WordBankNotFoundError);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
    });
    it('should throw an error if the entry is already assigned', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = Id.generate().getValue();
      const wordBank = WordBank.create({
        title: 'test',
        description: 'test',
        entryIds: [entryId],
      });
      mockWordBankRepository.findById.mockResolvedValue(wordBank);

      await expect(
        wordBankService.assignEntry(wordBankId, entryId),
      ).rejects.toThrow(DuplicateEntryError);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
    });
    it('should throw an error if the entry is not found', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = Id.generate().getValue();
      const wordBank = WordBank.create({
        title: 'test',
        description: 'test',
        entryIds: [],
      });
      mockWordBankRepository.findById.mockResolvedValue(wordBank);
      mockEntryRepository.findById.mockResolvedValue(undefined);

      await expect(
        wordBankService.assignEntry(wordBankId, entryId),
      ).rejects.toThrow(EntryNotFoundError);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
      expect(mockEntryRepository.findById).toHaveBeenCalledWith(entryId);
    });
    it('should assign an entry to a word bank', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = Id.generate().getValue();
      const wordBank = WordBank.create({
        id: wordBankId,
        title: 'test',
        description: 'test',
        entryIds: [],
      });
      const entry = Entry.create({
        id: entryId,
        term: 'test',
        pronunciation: 'pronunciation',
        definitions: [],
      });
      const updatedWordBank = WordBank.create({
        ...wordBank,
        id: wordBankId,
        entryIds: [entryId],
      });
      mockWordBankRepository.findById.mockResolvedValue(wordBank);
      mockEntryRepository.findById.mockResolvedValue(entry);
      mockWordBankRepository.save.mockResolvedValue(updatedWordBank);

      const result = await wordBankService.assignEntry(wordBankId, entryId);
      expect(result).toEqual(updatedWordBank);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
      expect(mockEntryRepository.findById).toHaveBeenCalledWith(entryId);
      expect(mockWordBankRepository.save).toHaveBeenCalledWith(wordBank);
    });
  });
});
