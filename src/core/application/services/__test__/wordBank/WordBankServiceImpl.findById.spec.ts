import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { WordBank } from 'src/core/domain/model/entities/WordBank';
import { mockWordBankRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockWordBankRepositoryFactory';
import { mockEntryRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockEntryRepositoryFactory';
import { WordBankServiceImpl } from '../../WordBankServiceImpl';
import { Id } from 'src/core/shared/domain/valueObjects/Id';
import { InvalidUUIDError } from 'src/core/application/errors/invalid-uuid.error';

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

  describe('findById', () => {
    it('should return a word bank by id', async () => {
      const wordBank = WordBank.create({
        title: 'test',
        description: 'test',
      });
      const id = wordBank.id.getValue();
      mockWordBankRepository.findById.mockResolvedValue(wordBank);

      const result = await wordBankService.findById(id);

      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toBe(wordBank);
    });

    it('should return undefined if the word bank is not found', async () => {
      const id = Id.generate().getValue();
      mockWordBankRepository.findById.mockResolvedValue(undefined);

      const result = await wordBankService.findById(id);

      expect(mockWordBankRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });

    it('should throw an error if the id is invalid', async () => {
      const id = 'invalid';

      await expect(wordBankService.findById(id)).rejects.toThrow(
        InvalidUUIDError,
      );
      expect(mockWordBankRepository.findById).not.toHaveBeenCalled();
    });
  });
});
