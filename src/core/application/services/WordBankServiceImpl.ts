import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { WordBankService } from '../../domain/ports/inbound/WordBankService';
import { NewWordBankDTO } from '../../shared/dto/NewWordBankDTO';
import { WordBank } from 'src/core/domain/model/entities/WordBank';
import { UpdatedWordBankDTO } from 'src/core/shared/dto/UpdatedWordBankDTO';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { WordBankNotFoundError } from '../errors/word-bank-not-found.error';
import { DuplicateEntryError } from '../errors/duplicate-entry.error';
import { EntryNotFoundError } from '../errors/entry-not-found.error';
import { InvalidUUIDError } from '../errors/invalid-uuid.error';
import { validate as isUuid } from 'uuid';

export class WordBankServiceImpl implements WordBankService {
  constructor(
    private wordBankRepository: WordBankRepository,
    private entryRepository: EntryRepository,
  ) {}

  async create(wordBank: NewWordBankDTO): Promise<WordBank> {
    const entity = WordBank.create(wordBank);
    return this.wordBankRepository.save(entity);
  }

  async findById(id: string): Promise<WordBank | undefined> {
    if (!isUuid(id)) {
      throw new InvalidUUIDError(id);
    }
    return this.wordBankRepository.findById(id);
  }

  async findAll(): Promise<WordBank[]> {
    return this.wordBankRepository.findAll();
  }

  async updateWordBank(
    wordBankId: string,
    updatedWorkBank: UpdatedWordBankDTO,
  ): Promise<WordBank> {
    if (!isUuid(wordBankId)) {
      throw new InvalidUUIDError(wordBankId);
    }
    const wordBank = await this.wordBankRepository.findById(wordBankId);
    if (!wordBank) {
      throw new WordBankNotFoundError(wordBankId);
    }
    wordBank.update(updatedWorkBank);
    return this.wordBankRepository.save(wordBank);
  }

  async assignEntry(wordBankId: string, entryId: string): Promise<WordBank> {
    if (!isUuid(wordBankId)) {
      throw new InvalidUUIDError(wordBankId);
    }
    if (!isUuid(entryId)) {
      throw new InvalidUUIDError(entryId);
    }
    const existingWordBank = await this.wordBankRepository.findById(wordBankId);
    if (!existingWordBank) {
      throw new WordBankNotFoundError(wordBankId);
    }
    if (existingWordBank.entryIds.includes(entryId)) {
      throw new DuplicateEntryError(entryId);
    }
    const existingEntry = await this.entryRepository.findById(entryId);
    if (!existingEntry) {
      throw new EntryNotFoundError(entryId);
    }
    existingWordBank.entryIds.push(entryId);
    return this.wordBankRepository.save(existingWordBank);
  }

  async assignEntryByTerm(wordBankId: string, term: string): Promise<WordBank> {
    if (!isUuid(wordBankId)) {
      throw new InvalidUUIDError(wordBankId);
    }
    const existingWordBank = await this.wordBankRepository.findById(wordBankId);
    if (!existingWordBank) {
      throw new WordBankNotFoundError(wordBankId);
    }
    const existingEntry = await this.entryRepository.findByTerm(term);
    if (!existingEntry) {
      throw new EntryNotFoundError(undefined, term);
    }
    const entryId = existingEntry.id.getValue();
    if (existingWordBank.entryIds.includes(entryId)) {
      throw new DuplicateEntryError(entryId);
    }
    existingWordBank.entryIds.push(entryId);
    return this.wordBankRepository.save(existingWordBank);
  }

  async unassignEntry(wordBankId: string, entryId: string): Promise<WordBank> {
    if (!isUuid(wordBankId)) {
      throw new InvalidUUIDError(wordBankId);
    }
    if (!isUuid(entryId)) {
      throw new InvalidUUIDError(entryId);
    }
    const wordBank = await this.wordBankRepository.findById(wordBankId);
    if (!wordBank) {
      throw new WordBankNotFoundError(wordBankId);
    }
    if (!wordBank.entryIds.includes(entryId)) {
      throw new EntryNotFoundError(entryId);
    }
    wordBank.unassignEntry(entryId);
    return this.wordBankRepository.save(wordBank);
  }

  async remove(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new InvalidUUIDError(id);
    }
    const wordBank = await this.wordBankRepository.findById(id);
    if (!wordBank) {
      throw new WordBankNotFoundError(id);
    }
    return this.wordBankRepository.remove(id);
  }
}
