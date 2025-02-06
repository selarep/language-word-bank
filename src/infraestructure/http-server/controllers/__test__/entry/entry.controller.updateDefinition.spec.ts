import { HttpStatus } from '@nestjs/common';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { EntryController } from '../../entry.controller';
import { mockEntryServiceFactory } from '../test-utils/mockEntryServiceFactory';
import { mockEntryControllerModuleFactory } from '../test-utils/mockEntryControllerModuleFactory';
import { Id } from 'src/core/shared/domain/valueObjects/Id';
import { Definition } from 'src/core/domain/model/entities/Definition';
import { UpdateDefinitionRequest } from 'src/infraestructure/http-server/model/update-definition.request';

describe('EntryController', () => {
  let controller: EntryController;
  let mockEntryService: jest.MockedObject<EntryService>;

  beforeEach(async () => {
    mockEntryService = mockEntryServiceFactory();
    const module = await mockEntryControllerModuleFactory(mockEntryService);
    controller = module.get<EntryController>(EntryController);
  });

  describe('updateDefinition', () => {
    it('should return 200 with updated definition data', async () => {
      const entryId = Id.generate().getValue();
      const previousDefinition = Definition.create({
        definitionText: 'test definition',
        examples: ['there is a house in New Orleans'],
      });
      const request: UpdateDefinitionRequest = {
        definitionText: 'test definition 2',
        examples: ['there is a house in New Orleans'],
      };
      const definition = previousDefinition.update(request);
      mockEntryService.updateDefinition.mockResolvedValue(definition);

      const result = await controller.updateDefinition(
        entryId,
        previousDefinition.id.getValue(),
        request,
      );

      expect(mockEntryService.updateDefinition).toHaveBeenCalledWith(
        entryId,
        previousDefinition.id.getValue(),
        request,
      );
      expect(result).toEqual({ status: HttpStatus.OK, data: { definition } });
    });
  });
});
