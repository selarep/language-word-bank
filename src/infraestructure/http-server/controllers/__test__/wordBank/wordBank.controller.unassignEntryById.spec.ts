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

  describe('unassignEntryById', () => {
    it('should unassign an entry from a word bank', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = Id.generate().getValue();
      const wordBank = WordBank.create({
        title: 'Test',
        description: 'Test description',
      });

      mockWordBankService.unassignEntry.mockResolvedValue(wordBank);

      const result = await controller.unassignEntryById(wordBankId, entryId);

      expect(mockWordBankService.unassignEntry).toHaveBeenCalledWith(
        wordBankId,
        entryId,
      );
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: { wordBank },
      });
    });

    it('should throw error if unassignEntry throws', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = Id.generate().getValue();

      mockWordBankService.unassignEntry.mockRejectedValue(
        new WordBankNotFoundError(wordBankId),
      );

      await expect(
        controller.unassignEntryById(wordBankId, entryId),
      ).rejects.toThrow(WordBankNotFoundError);
      expect(mockWordBankService.unassignEntry).toHaveBeenCalledWith(
        wordBankId,
        entryId,
      );
    });
  });
});
