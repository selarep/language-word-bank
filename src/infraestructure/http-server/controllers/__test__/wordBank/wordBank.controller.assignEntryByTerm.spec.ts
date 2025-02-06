import { HttpStatus } from '@nestjs/common';
import { WordBank } from 'src/core/domain/model/entities/WordBank';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';
import { WordBankController } from '../../wordBank.controller';
import { mockEntryServiceFactory } from '../test-utils/mockEntryServiceFactory';
import { mockWordBankControllerModuleFactory } from '../test-utils/mockWordBankControllerModuleFactory';
import { mockWordBankServiceFactory } from '../test-utils/mockWordBankServiceFactory';
import { WordBankNotFoundError } from 'src/core/application/errors/word-bank-not-found.error';
import { Id } from 'src/core/shared/domain/valueObjects/Id';

describe('WordBankController', () => {
  let controller: WordBankController;
  let mockWordBankService: jest.MockedObject<WordBankService>;
  let mockEntryService: jest.MockedObject<EntryService>;

  beforeEach(async () => {
    mockWordBankService = mockWordBankServiceFactory();
    mockEntryService = mockEntryServiceFactory();

    const module = await mockWordBankControllerModuleFactory(
      mockWordBankService,
      mockEntryService,
    );

    controller = module.get<WordBankController>(WordBankController);
  });

  describe('assignEntryByTerm', () => {
    it('should assign an entry to a word bank by term', async () => {
      const wordBankId = Id.generate().getValue();
      const term = 'test';
      const wordBank = WordBank.create({
        title: 'Test',
        description: 'Test description',
      });

      mockWordBankService.assignEntryByTerm.mockResolvedValue(wordBank);

      const result = await controller.assignEntryByTerm(wordBankId, term);

      expect(mockWordBankService.assignEntryByTerm).toHaveBeenCalledWith(
        wordBankId,
        term,
      );
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        data: { wordBank },
      });
    });

    it('should throw error if assignEntryByTerm throws', async () => {
      const wordBankId = Id.generate().getValue();
      const term = 'test';

      mockWordBankService.assignEntryByTerm.mockRejectedValue(
        new WordBankNotFoundError(wordBankId),
      );

      await expect(
        controller.assignEntryByTerm(wordBankId, term),
      ).rejects.toThrow(WordBankNotFoundError);
      expect(mockWordBankService.assignEntryByTerm).toHaveBeenCalledWith(
        wordBankId,
        term,
      );
    });
  });
});
