import { HttpStatus } from '@nestjs/common';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { EntryController } from '../../entry.controller';
import { mockEntryServiceFactory } from '../test-utils/mockEntryServiceFactory';
import { mockEntryControllerModuleFactory } from '../test-utils/mockEntryControllerModuleFactory';
import { Id } from 'src/core/shared/domain/valueObjects/Id';

describe('EntryController', () => {
  let controller: EntryController;
  let mockEntryService: jest.MockedObject<EntryService>;

  beforeEach(async () => {
    mockEntryService = mockEntryServiceFactory();
    const module = await mockEntryControllerModuleFactory(mockEntryService);
    controller = module.get<EntryController>(EntryController);
  });

  describe('removeDefinition', () => {
    it('should return 204', async () => {
      const entryId = Id.generate().getValue();
      const definitionId = Id.generate().getValue();
      const result = await controller.removeDefinition(entryId, definitionId);

      expect(mockEntryService.removeDefinition).toHaveBeenCalledWith(
        entryId,
        definitionId,
      );
      expect(result).toEqual({ status: HttpStatus.NO_CONTENT });
    });
  });
});
