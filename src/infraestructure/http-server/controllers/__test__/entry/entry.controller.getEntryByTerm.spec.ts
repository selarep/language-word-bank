import { HttpStatus } from '@nestjs/common';
import { EntryNotFoundError } from 'src/core/application/errors/entry-not-found.error';
import { Entry } from 'src/core/domain/model/entities/Entry';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { EntryController } from '../../entry.controller';
import { mockEntryServiceFactory } from '../test-utils/mockEntryServiceFactory';
import { mockEntryControllerModuleFactory } from '../test-utils/mockEntryControllerModuleFactory';

describe('EntryController', () => {
  let controller: EntryController;
  let mockEntryService: jest.MockedObject<EntryService>;

  beforeEach(async () => {
    mockEntryService = mockEntryServiceFactory();
    const module = await mockEntryControllerModuleFactory(mockEntryService);
    controller = module.get<EntryController>(EntryController);
  });

  describe('getEntryByTerm', () => {
    it('should return 400 if no term is provided', async () => {
      const result = await controller.getEntryByTerm('');

      expect(mockEntryService.findByTerm).not.toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        message: 'No term provided',
      });
    });

    it('should return 404 if entry is not found', async () => {
      mockEntryService.findByTerm.mockRejectedValue(
        new EntryNotFoundError(undefined, 'test'),
      );

      await expect(controller.getEntryByTerm('test')).rejects.toThrow(
        EntryNotFoundError,
      );
      expect(mockEntryService.findByTerm).toHaveBeenCalledWith('test');
    });

    it('should return 200 with entry data', async () => {
      const entry = Entry.create({
        term: 'test',
        pronunciation: 'pronunciation',
        definitions: [],
      });
      mockEntryService.findByTerm.mockResolvedValue(entry);

      const result = await controller.getEntryByTerm('test');

      expect(mockEntryService.findByTerm).toHaveBeenCalledWith('test');
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: { entry },
      });
    });
  });
});
