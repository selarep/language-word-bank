import { HttpStatus } from '@nestjs/common';
import { WordBank } from 'src/core/domain/model/entities/WordBank';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';
import { CreateWordBankRequest } from 'src/infraestructure/http-server/model/create-wordBank.request';
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

  describe('createWordBank', () => {
    it('should create a word bank', async () => {
      const request: CreateWordBankRequest = {
        title: 'Test',
        description: 'Test description',
      };
      const mockedWordBank = WordBank.create(request);
      mockWordBankService.create.mockResolvedValue(mockedWordBank);

      const result = await controller.createWordBank(request);

      expect(mockWordBankService.create).toHaveBeenCalledWith(request);
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        data: { wordBank: mockedWordBank },
      });
    });
  });
});
