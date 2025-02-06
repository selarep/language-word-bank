import { HttpStatus } from '@nestjs/common';
import { WordBank } from 'src/core/domain/model/entities/WordBank';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';
import { WordBankController } from '../../wordBank.controller';
import { mockEntryServiceFactory } from '../test-utils/mockEntryServiceFactory';
import { mockWordBankControllerModuleFactory } from '../test-utils/mockWordBankControllerModuleFactory';
import { mockWordBankServiceFactory } from '../test-utils/mockWordBankServiceFactory';

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

  describe('getWordBankById', () => {
    it('should return a word bank by id', async () => {
      const wordBank = WordBank.create({
        title: 'Test',
        description: 'Test description',
      });

      mockWordBankService.findById.mockResolvedValue(wordBank);

      const result = await controller.getWordBankById(wordBank.id.getValue());

      expect(mockWordBankService.findById).toHaveBeenCalledWith(
        wordBank.id.getValue(),
      );
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: { wordBank },
      });
    });
  });
});
