import { Repository, SelectQueryBuilder } from 'typeorm';
import { EntryEntity } from '../database/entities/entry.entity';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { EntryRepositoryAdapter } from './entry.repository.adapter';
import { DefinitionEntity } from '../database/entities/defiinition.entity';
import { Id } from 'src/core/shared/domain/valueObjects/Id';
import { Definition } from 'src/core/domain/model/entities/Definition';
import { Entry } from 'src/core/domain/model/entities/Entry';

describe('EntryRepositoryAdapter', () => {
  let mockEntrySelectQueryBuilder: jest.MockedObject<
    SelectQueryBuilder<EntryEntity>
  >;
  let mockEntryRepository: jest.MockedObjectDeep<Repository<EntryEntity>>;
  let mockDefinitionRepository: jest.MockedObject<Repository<DefinitionEntity>>;
  let entryRepositoryAdapter: EntryRepository;

  beforeEach(() => {
    mockEntrySelectQueryBuilder = {
      innerJoin: jest.fn().mockReturnThis(),
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    } as jest.MockedObject<SelectQueryBuilder<EntryEntity>>;
    mockEntryRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(
        () => mockEntrySelectQueryBuilder as SelectQueryBuilder<EntryEntity>,
      ),
    } as unknown as jest.MockedObjectDeep<Repository<EntryEntity>>;
    mockDefinitionRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as jest.MockedObject<Repository<DefinitionEntity>>;

    entryRepositoryAdapter = new EntryRepositoryAdapter(
      mockEntryRepository,
      mockDefinitionRepository,
    );
  });

  describe('findById', () => {
    it('should return undefined if the TypeORM repository method findOne returns null', async () => {
      const id = Id.generate().getValue();
      mockEntryRepository.findOne.mockResolvedValue(null);

      const result = await entryRepositoryAdapter.findById(id);

      expect(result).toBeUndefined();
      expect(mockEntryRepository.findOne).toHaveBeenCalled();
    });
    it('should return an Entry entity found by id', async () => {
      const entryId = Id.generate().getValue();
      const definitionId = Id.generate().getValue();

      const definitionDb = new DefinitionEntity();
      definitionDb.definitionId = definitionId;
      definitionDb.definitionText = 'Lorem ipsum';
      definitionDb.examples = ['example'];

      const entryDb = new EntryEntity();
      entryDb.entryId = entryId;
      entryDb.term = 'term';
      entryDb.pronunciation = 'pronunciation';
      entryDb.definitions = [definitionDb];

      mockEntryRepository.findOne.mockResolvedValue(entryDb);

      const expectedEntry = Entry.create({
        id: entryId,
        term: 'term',
        pronunciation: 'pronunciation',
        definitions: [
          {
            id: definitionId,
            definitionText: 'Lorem ipsum',
            examples: ['example'],
          },
        ],
      });

      const result = await entryRepositoryAdapter.findById(entryId);

      expect(result).toEqual(expectedEntry);
      expect(mockEntryRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findByTerm', () => {
    it('should return undefined if the TypeORM repository method findOne returns null', async () => {
      mockEntryRepository.findOne.mockResolvedValue(null);

      const result = await entryRepositoryAdapter.findByTerm('term');

      expect(result).toBeUndefined();
      expect(mockEntryRepository.findOne).toHaveBeenCalled();
    });
    it('should return an Entry entity found by term', async () => {
      const entryId = Id.generate().getValue();

      const entryDb = new EntryEntity();
      entryDb.entryId = entryId;
      entryDb.term = 'term';
      entryDb.pronunciation = 'pronunciation';
      entryDb.definitions = [];

      mockEntryRepository.findOne.mockResolvedValue(entryDb);

      const expectedEntry = Entry.create({
        id: entryId,
        term: 'term',
        pronunciation: 'pronunciation',
        definitions: [],
      });

      const result = await entryRepositoryAdapter.findByTerm('term');

      expect(result).toEqual(expectedEntry);
      expect(mockEntryRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findAllFromWordBank', () => {
    it('should return an array of Entry entities', async () => {
      const wordBankId = Id.generate().getValue();
      const entryId = Id.generate().getValue();

      const entryDb = new EntryEntity();
      entryDb.entryId = entryId;
      entryDb.term = 'term';
      entryDb.pronunciation = 'pronunciation';
      entryDb.definitions = [];

      mockEntrySelectQueryBuilder.getMany.mockResolvedValue([entryDb]);

      const expectedEntry = Entry.create({
        id: entryId,
        term: 'term',
        pronunciation: 'pronunciation',
        definitions: [],
      });

      const result =
        await entryRepositoryAdapter.findAllFromWordBank(wordBankId);

      expect(result).toEqual([expectedEntry]);
      expect(mockEntryRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockEntrySelectQueryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('addDefinition', () => {
    it('should add a definition to an entry', async () => {
      const entryId = Id.generate().getValue();
      const definition = Definition.create({
        definitionText: 'definition',
        examples: ['example'],
      });

      const definitionDb = new DefinitionEntity();
      definitionDb.definitionId = definition.id.getValue();
      definitionDb.definitionText = definition.definitionText;
      definitionDb.examples = definition.examples;

      mockDefinitionRepository.save.mockResolvedValue(definitionDb);

      const result = await entryRepositoryAdapter.addDefinition(
        entryId,
        definition,
      );

      expect(result).toEqual(definition);
      expect(mockDefinitionRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateDefinition', () => {
    it('should throw an error if the definition is not found', async () => {
      const entryId = Id.generate().getValue();
      const definitionId = Id.generate().getValue();
      const definition = Definition.create({
        id: definitionId,
        definitionText: 'definition',
        examples: ['example'],
      });

      mockDefinitionRepository.findOneBy.mockResolvedValue(null);

      await expect(
        entryRepositoryAdapter.updateDefinition(
          entryId,
          definitionId,
          definition,
        ),
      ).rejects.toThrow(Error);
    });
    it('should update a definition', async () => {
      const entryId = Id.generate().getValue();
      const definitionId = Id.generate().getValue();
      const definition = Definition.create({
        id: definitionId,
        definitionText: 'definition',
        examples: ['example'],
      });

      const definitionDb = new DefinitionEntity();
      definitionDb.definitionId = definition.id.getValue();
      definitionDb.definitionText = definition.definitionText;
      definitionDb.examples = definition.examples;

      mockDefinitionRepository.findOneBy.mockResolvedValue(definitionDb);

      const result = await entryRepositoryAdapter.updateDefinition(
        entryId,
        definitionId,
        definition,
      );

      expect(result).toEqual(definition);
      expect(mockDefinitionRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('removeDefinition', () => {
    it('should remove a definition', async () => {
      const definitionId = Id.generate().getValue();

      await entryRepositoryAdapter.removeDefinition(definitionId);

      expect(mockDefinitionRepository.delete).toHaveBeenCalledWith({
        definitionId,
      });
    });
  });

  describe('save', () => {
    it('should save an entry', async () => {
      const entry = Entry.create({
        term: 'term',
        pronunciation: 'pronunciation',
        definitions: [],
      });

      const entryDb = new EntryEntity();
      entryDb.entryId = entry.id.getValue();
      entryDb.term = entry.term;
      entryDb.pronunciation = entry.pronunciation.getValue();

      mockEntryRepository.save.mockResolvedValue(entryDb);

      const result = await entryRepositoryAdapter.save(entry);

      expect(result).toEqual(entry);
      expect(mockEntryRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an entry', async () => {
      const id = Id.generate().getValue();

      await entryRepositoryAdapter.remove(id);

      expect(mockEntryRepository.delete).toHaveBeenCalledWith({ entryId: id });
    });
  });
});
