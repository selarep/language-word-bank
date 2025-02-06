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
import { EntryNotFoundError } from 'src/core/application/errors/entry-not-found.error';

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

  describe('unassignEntry', () => {
    it('should throw an error if the word bank id is invalid', async () => {
      const wordBankId = 'invalid';
      const entryId = Id.generate().getValue();

      await expect(
        wordBankService.unassignEntry(wordBankId, entryId),
      ).rejects.toThrow(InvalidUUIDError);
      expect(mockWordBankRepository.findById).not.toHaveBeenCalled();
    });
    it('should throw an error if the entry id is invalid', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = 'invalid';

      await expect(
        wordBankService.unassignEntry(wordBankId, entryId),
      ).rejects.toThrow(InvalidUUIDError);
      expect(mockWordBankRepository.findById).not.toHaveBeenCalled();
    });
    it('should throw an error if the word bank is not found', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = Id.generate().getValue();
      mockWordBankRepository.findById.mockResolvedValue(undefined);

      await expect(
        wordBankService.unassignEntry(wordBankId, entryId),
      ).rejects.toThrow(WordBankNotFoundError);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
    });
    it('should throw an error if the entry is not assigned', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = Id.generate().getValue();
      const wordBank = WordBank.create({
        title: 'test',
        description: 'test',
        entryIds: [],
      });
      mockWordBankRepository.findById.mockResolvedValue(wordBank);

      await expect(
        wordBankService.unassignEntry(wordBankId, entryId),
      ).rejects.toThrow(EntryNotFoundError);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
    });
    it('should unassign an entry from a word bank', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = Id.generate().getValue();
      const wordBank = WordBank.create({
        id: wordBankId,
        title: 'test',
        description: 'test',
        entryIds: [entryId],
      });
      const updatedWordBank = WordBank.create({
        ...wordBank,
        id: wordBank.id.getValue(),
        entryIds: [],
      });
      mockWordBankRepository.findById.mockResolvedValue(wordBank);
      mockWordBankRepository.save.mockResolvedValue(updatedWordBank);

      const result = await wordBankService.unassignEntry(wordBankId, entryId);
      expect(result).toEqual(updatedWordBank);
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(wordBankId);
      expect(mockWordBankRepository.save).toHaveBeenCalledWith(updatedWordBank);
    });
  });
});
