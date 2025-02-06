import { Test, TestingModule } from '@nestjs/testing';
import { WORD_BANK_SERVICE, ENTRY_SERVICE } from 'src/core/core.module';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { WordBankController } from '../../wordBank.controller';
import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';

export const mockWordBankControllerModuleFactory = async (
  wordBankService: WordBankService,
  entryService: EntryService,
): Promise<TestingModule> => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [WordBankController],
    providers: [
      {
        provide: WORD_BANK_SERVICE,
        useValue: wordBankService,
      },
      {
        provide: ENTRY_SERVICE,
        useValue: entryService,
      },
    ],
  }).compile();

  return module;
};
