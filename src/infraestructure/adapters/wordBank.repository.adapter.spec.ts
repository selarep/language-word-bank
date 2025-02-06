import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { Repository } from 'typeorm';
import { WordBankEntity } from '../database/entities/wordBank.entity';
import { WordBankRepositoryAdapter } from './wordBank.repository.adapter';
import { Id } from 'src/core/shared/domain/valueObjects/Id';
import { WordBank } from 'src/core/domain/model/entities/WordBank';
import { EntryEntity } from '../database/entities/entry.entity';

describe('WordBankRepositoryAdapter', () => {
  let mockWordBankRepository: jest.MockedObject<Repository<WordBankEntity>>;
  let wordBankRepositoryAdapter: WordBankRepository;

  beforeEach(() => {
    mockWordBankRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as jest.MockedObject<Repository<WordBankEntity>>;

    wordBankRepositoryAdapter = new WordBankRepositoryAdapter(
      mockWordBankRepository,
    );
  });

  describe('findById', () => {
    it('should return undefined if the TypeORM repository method findOne returns null', async () => {
      const id = Id.generate().getValue();
      mockWordBankRepository.findOne.mockResolvedValue(null);

      const result = await wordBankRepositoryAdapter.findById(id);

      expect(result).toBeUndefined();
      expect(mockWordBankRepository.findOne).toHaveBeenCalled();
    });
    it('should return a WordBank entity found by id', async () => {
      const id = Id.generate().getValue();
      const entryId = Id.generate().getValue();
      const wordBank = WordBank.create({
        id,
        title: 'title',
        description: 'description',
        entryIds: [entryId],
      });
      const wordBankEntity = new WordBankEntity();
      wordBankEntity.wordBankId = id;
      wordBankEntity.title = wordBank.title;
      wordBankEntity.description = wordBank.description;
      wordBankEntity.entries = [{ entryId } as EntryEntity];

      mockWordBankRepository.findOne.mockResolvedValue(wordBankEntity);

      const result = await wordBankRepositoryAdapter.findById(id);

      expect(result).toEqual(wordBank);
      expect(mockWordBankRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of WordBank entities', async () => {
      const wordBank = WordBank.create({
        title: 'title',
        description: 'description',
        entryIds: [],
      });
      const wordBankEntity = new WordBankEntity();
      wordBankEntity.wordBankId = wordBank.id.getValue();
      wordBankEntity.title = wordBank.title;
      wordBankEntity.description = wordBank.description;
      wordBankEntity.entries = [];

      mockWordBankRepository.find.mockResolvedValue([wordBankEntity]);

      const result = await wordBankRepositoryAdapter.findAll();

      expect(result).toEqual([wordBank]);
      expect(mockWordBankRepository.find).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save a WordBank entity', async () => {
      const entryId = Id.generate().getValue();
      const wordBank = WordBank.create({
        title: 'title',
        description: 'description',
        entryIds: [entryId],
      });
      const wordBankEntity = new WordBankEntity();
      wordBankEntity.wordBankId = wordBank.id.getValue();
      wordBankEntity.title = wordBank.title;
      wordBankEntity.description = wordBank.description;
      wordBankEntity.entries = [{ entryId } as EntryEntity];

      mockWordBankRepository.save.mockResolvedValue(wordBankEntity);

      const result = await wordBankRepositoryAdapter.save(wordBank);

      expect(result).toEqual(wordBank);
      expect(mockWordBankRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a WordBank entity', async () => {
      const id = Id.generate().getValue();

      mockWordBankRepository.delete.mockResolvedValue({
        raw: '',
        affected: 1,
      });

      await wordBankRepositoryAdapter.remove(id);

      expect(mockWordBankRepository.delete).toHaveBeenCalled();
    });
  });
});
