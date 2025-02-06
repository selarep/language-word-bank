import { HttpStatus } from '@nestjs/common';
import { EntryNotFoundError } from 'src/core/application/errors/entry-not-found.error';
import { Entry } from 'src/core/domain/model/entities/Entry';
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

  describe('getEntryById', () => {
    it('should return 200 with entry data', async () => {
      const entry = Entry.create({
        term: 'test',
        pronunciation: 'pronunciation',
        definitions: [],
      });
      mockEntryService.findById.mockResolvedValue(entry);

      const result = await controller.getEntryById(entry.id.getValue());

      expect(mockEntryService.findById).toHaveBeenCalledWith(
        entry.id.getValue(),
      );
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: { entry },
      });
    });

    it('should return 404 if entry is not found', async () => {
      const id = Id.generate().getValue();
      mockEntryService.findById.mockRejectedValue(new EntryNotFoundError(id));

      await expect(controller.getEntryById(id)).rejects.toThrow(
        EntryNotFoundError,
      );
      expect(mockEntryService.findById).toHaveBeenCalledWith(id);
    });
  });
});
