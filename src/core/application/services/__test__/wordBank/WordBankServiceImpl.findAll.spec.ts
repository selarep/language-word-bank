import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
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

  describe('findAll', () => {
    it('should return all word banks', async () => {
      const wordBanks = [
        WordBank.create({
          title: 'test1',
          description: 'test description 1',
        }),
        WordBank.create({
          title: 'test2',
          description: 'test description 2',
        }),
      ];
      mockWordBankRepository.findAll.mockResolvedValue(wordBanks);

      const result = await wordBankService.findAll();

      expect(mockWordBankRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(wordBanks);
    });
  });
});
