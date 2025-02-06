import { HttpStatus } from '@nestjs/common';
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

  describe('deleteWordBank', () => {
    it('should delete a word bank', async () => {
      const wordBankId = Id.generate().getValue();
      const result = await controller.deleteWordBank(wordBankId);

      expect(mockWordBankService.remove).toHaveBeenCalledWith(wordBankId);
      expect(result).toEqual({
        status: HttpStatus.NO_CONTENT,
      });
    });

    it('should throw error if remove throws', async () => {
      const wordBankId = Id.generate().getValue();

      mockWordBankService.remove.mockRejectedValue(
        new WordBankNotFoundError(wordBankId),
      );

      await expect(controller.deleteWordBank(wordBankId)).rejects.toThrow(
        WordBankNotFoundError,
      );
      expect(mockWordBankService.remove).toHaveBeenCalledWith(wordBankId);
    });
  });
});
