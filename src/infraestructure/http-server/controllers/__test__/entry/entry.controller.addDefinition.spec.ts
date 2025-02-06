import { HttpStatus } from '@nestjs/common';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { EntryController } from '../../entry.controller';
import { mockEntryServiceFactory } from '../test-utils/mockEntryServiceFactory';
import { mockEntryControllerModuleFactory } from '../test-utils/mockEntryControllerModuleFactory';
import { Definition } from 'src/core/domain/model/entities/Definition';
import { Id } from 'src/core/shared/domain/valueObjects/Id';
import { CreateDefinitionRequest } from 'src/infraestructure/http-server/model/create-definition.request';

describe('EntryController', () => {
  let controller: EntryController;
  let mockEntryService: jest.MockedObject<EntryService>;

  beforeEach(async () => {
    mockEntryService = mockEntryServiceFactory();
    const module = await mockEntryControllerModuleFactory(mockEntryService);
    controller = module.get<EntryController>(EntryController);
  });

  describe('addDefinition', () => {
    it('should return 201 with definition data', async () => {
      const request: CreateDefinitionRequest = {
        definitionText: 'test definition',
        examples: ['there is a house in New Orleans'],
      };
      const definition = Definition.create(request);
      mockEntryService.addDefinition.mockResolvedValue(definition);
      const entryId = Id.generate().getValue();

      const result = await controller.addDefinition(entryId, request);

      expect(mockEntryService.addDefinition).toHaveBeenCalledWith(
        entryId,
        request,
      );
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        data: { definition },
      });
    });
  });
});
