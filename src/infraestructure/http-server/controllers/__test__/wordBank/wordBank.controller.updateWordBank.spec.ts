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
import { UpdateWordBankRequest } from 'src/infraestructure/http-server/model/update-wordBank.request';

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

  describe('updateWordBank', () => {
    it('should update a word bank', async () => {
      const wordBankId = Id.generate().getValue();
      const previousWordBank = WordBank.create({
        title: 'Test',
        description: 'Test description',
      });
      const request: UpdateWordBankRequest = {
        description: 'Test description 123',
      };
      const wordBank = previousWordBank.update(request);
      mockWordBankService.updateWordBank.mockResolvedValue(wordBank);

      const result = await controller.updateWordBank(wordBankId, request);

      expect(mockWordBankService.updateWordBank).toHaveBeenCalledWith(
        wordBankId,
        request,
      );
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: { wordBank },
      });
    });

    it('should throw error if updateWordBank throws', async () => {
      const wordBankId = Id.generate().getValue();
      const request: UpdateWordBankRequest = {
        title: 'Test',
        description: 'Test description',
      };

      mockWordBankService.updateWordBank.mockRejectedValue(
        new WordBankNotFoundError(wordBankId),
      );

      await expect(
        controller.updateWordBank(wordBankId, request),
      ).rejects.toThrow(WordBankNotFoundError);
      expect(mockWordBankService.updateWordBank).toHaveBeenCalledWith(
        wordBankId,
        request,
      );
    });
  });
});
