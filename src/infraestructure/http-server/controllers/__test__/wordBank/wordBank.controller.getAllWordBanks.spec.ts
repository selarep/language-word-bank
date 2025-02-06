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

  describe('getAllWordBanks', () => {
    it('should return all word banks', async () => {
      const wordBanks = [
        WordBank.create({
          title: 'Test',
          description: 'Test description',
        }),
      ];

      mockWordBankService.findAll.mockResolvedValue(wordBanks);

      const result = await controller.getAllWordBanks();

      expect(mockWordBankService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: { wordBanks },
      });
    });
  });
});
