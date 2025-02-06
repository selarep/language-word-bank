import { HttpStatus } from '@nestjs/common';
import { EntryNotFoundError } from 'src/core/application/errors/entry-not-found.error';
import { Entry } from 'src/core/domain/model/entities/Entry';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { CreateEntryRequest } from 'src/infraestructure/http-server/model/create-entry.request';
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

  describe('createEntry', () => {
    it('should return 409 if entry already exists', async () => {
      const request: CreateEntryRequest = {
        term: 'test',
        pronunciation: 'pronunciation',
        definitions: [],
      };
      mockEntryService.findByTerm.mockResolvedValue(Entry.create(request));

      const result = await controller.createEntry(request);

      expect(mockEntryService.findByTerm).toHaveBeenCalledWith(request.term);
      expect(mockEntryService.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatus.CONFLICT,
        message: 'Entry already exists',
      });
    });

    it('should throw if findByTerm throws something different from 404', async () => {
      const request: CreateEntryRequest = {
        term: 'test',
        pronunciation: 'pronunciation',
        definitions: [],
      };
      mockEntryService.findByTerm.mockRejectedValue(new Error());

      await expect(controller.createEntry(request)).rejects.toThrow(Error);
      expect(mockEntryService.findByTerm).toHaveBeenCalledWith(request.term);
      expect(mockEntryService.create).not.toHaveBeenCalled();
    });

    it('should return 201 if entry is created', async () => {
      const request: CreateEntryRequest = {
        term: 'test',
        pronunciation: 'pronunciation',
        definitions: [],
      };
      mockEntryService.findByTerm.mockRejectedValue(
        new EntryNotFoundError(undefined, 'test'),
      );
      const mockedEntry = Entry.create(request);
      mockEntryService.create.mockResolvedValue(mockedEntry);

      const result = await controller.createEntry(request);

      expect(mockEntryService.findByTerm).toHaveBeenCalledWith(request.term);
      expect(mockEntryService.create).toHaveBeenCalledWith(request);
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        data: { entry: mockedEntry },
      });
    });
  });
});
