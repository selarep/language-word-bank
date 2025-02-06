import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { NewWordBankDTO } from 'src/core/shared/dto/NewWordBankDTO';
import { WordBank } from 'src/core/domain/model/entities/WordBank';
import { mockWordBankRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockWordBankRepositoryFactory';
import { mockEntryRepositoryFactory } from 'src/core/application/services/__test__/test-utils/mockEntryRepositoryFactory';
import { WordBankServiceImpl } from '../../WordBankServiceImpl';

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

  describe('create', () => {
    it('should create a new word bank', async () => {
      const newWordBankDto: NewWordBankDTO = {
        title: 'test',
        description: 'test',
      };
      mockWordBankRepository.save.mockImplementation(
        (wordBank) => new Promise((resolve) => resolve(wordBank)),
      );

      const wordBank = await wordBankService.create(newWordBankDto);

      expect(mockWordBankRepository.save).toHaveBeenCalledWith(wordBank);
      expect(wordBank).toEqual(
        WordBank.create({
          ...newWordBankDto,
          id: wordBank.id.getValue(),
        }),
      );
    });

    it('should throw an error if the word bank could not be created', async () => {
      const newWordBankDto: NewWordBankDTO = {
        title: 'test',
        description: 'test',
      };
      mockWordBankRepository.save.mockRejectedValue(new Error('Error'));

      await expect(wordBankService.create(newWordBankDto)).rejects.toThrow(
        Error,
      );
    });
  });
});
