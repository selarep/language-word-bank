import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { WordBank } from 'src/core/domain/model/entities/WordBank';
import { mockWordBankRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockWordBankRepositoryFactory';
import { mockEntryRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockEntryRepositoryFactory';
import { WordBankServiceImpl } from '../../WordBankServiceImpl';
import { InvalidUUIDError } from 'src/core/application/errors/invalid-uuid.error';
import { WordBankNotFoundError } from 'src/core/application/errors/word-bank-not-found.error';
import { Id } from 'src/core/shared/domain/valueObjects/Id';

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

  describe('remove', () => {
    it('should throw an error if the id is invalid', async () => {
      const id = 'invalid';

      await expect(wordBankService.remove(id)).rejects.toThrow(
        InvalidUUIDError,
      );
      expect(mockWordBankRepository.findById).not.toHaveBeenCalled();
      expect(mockWordBankRepository.remove).not.toHaveBeenCalled();
    });
    it('should throw an error if the word bank is not found', async () => {
      const id = Id.generate().getValue();
      mockWordBankRepository.findById.mockResolvedValue(undefined);

      await expect(wordBankService.remove(id)).rejects.toThrow(
        WordBankNotFoundError,
      );
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(id);
      expect(mockWordBankRepository.remove).not.toHaveBeenCalled();
    });
    it('should remove a word bank', async () => {
      const id = Id.generate().getValue();
      const wordBank = WordBank.create({
        id,
        title: 'test',
        description: 'test',
      });
      mockWordBankRepository.findById.mockResolvedValue(wordBank);

      const result = await wordBankService.remove(id);
      expect(result).toBeUndefined();
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(id);
      expect(mockWordBankRepository.remove).toHaveBeenCalledWith(id);
    });
  });
});
