import { Test, TestingModule } from '@nestjs/testing';
import { ENTRY_SERVICE } from 'src/core/core.module';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { EntryController } from 'src/infraestructure/http-server/controllers/entry.controller';

export const mockEntryControllerModuleFactory = async (
  entryService: EntryService,
): Promise<TestingModule> => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [EntryController],
    providers: [
      {
        provide: ENTRY_SERVICE,
        useValue: entryService,
      },
    ],
  }).compile();

  return module;
};
