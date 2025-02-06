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

  describe('updateWordBank', () => {
    it('should throw an error if the id is invalid', async () => {
      const id = 'invalid';

      await expect(wordBankService.updateWordBank(id, {})).rejects.toThrow(
        InvalidUUIDError,
      );
      expect(mockWordBankRepository.findById).not.toHaveBeenCalled();
    });
    it('should throw an error if the word bank is not found', async () => {
      const id = Id.generate().getValue();
      mockWordBankRepository.findById.mockResolvedValue(undefined);

      await expect(wordBankService.updateWordBank(id, {})).rejects.toThrow(
        WordBankNotFoundError,
      );
      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(id);
    });
    it('should update a word bank', async () => {
      const wordBank = WordBank.create({
        title: 'test',
        description: 'test',
      });
      const updateWordBankRequest = {
        title: 'test updated',
        description: 'test updated',
      };
      const updatedWordBank = WordBank.create({
        ...wordBank,
        id: wordBank.id.getValue(),
        ...updateWordBankRequest,
      });
      const id = wordBank.id.getValue();
      mockWordBankRepository.findById.mockResolvedValue(wordBank);
      mockWordBankRepository.save.mockResolvedValue(updatedWordBank);

      const result = await wordBankService.updateWordBank(
        id,
        updateWordBankRequest,
      );

      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(id);
      expect(mockWordBankRepository.save).toHaveBeenCalledWith(updatedWordBank);
      expect(result).toBe(updatedWordBank);
    });
  });
});
