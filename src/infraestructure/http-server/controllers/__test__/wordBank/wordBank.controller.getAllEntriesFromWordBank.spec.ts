import { HttpStatus } from '@nestjs/common';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';
import { WordBankController } from '../../wordBank.controller';
import { mockEntryServiceFactory } from '../test-utils/mockEntryServiceFactory';
import { mockWordBankControllerModuleFactory } from '../test-utils/mockWordBankControllerModuleFactory';
import { mockWordBankServiceFactory } from '../test-utils/mockWordBankServiceFactory';
import { Entry } from 'src/core/domain/model/entities/Entry';
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

  describe('getAllEntriesFromWordBank', () => {
    it('should return all entries from a word bank', async () => {
      const wordBankId = Id.generate().getValue();
      const entries = [
        Entry.create({
          term: 'test',
          pronunciation: 'pronunciation',
          definitions: [],
        }),
      ];

      mockEntryService.findAllFromWordBank.mockResolvedValue(entries);

      const result = await controller.getAllEntriesFromWordBank(wordBankId);

      expect(mockEntryService.findAllFromWordBank).toHaveBeenCalledWith(
        wordBankId,
      );
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: { entries },
      });
    });
  });
});
