import { Definition } from 'src/core/domain/model/entities/Definition';
import { Entry } from 'src/core/domain/model/entities/Entry';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { NewDefinitionDTO } from 'src/core/shared/dto/NewDefinitionDTO';
import { NewEntryDTO } from 'src/core/shared/dto/NewEntryDTO';
import { EntryNotFoundError } from '../errors/entry-not-found.error';
import { DefinitionNotFoundError } from '../errors/definition-not-found.error';
import { DuplicateEntryError } from '../errors/duplicate-entry.error';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { WordBankNotFoundError } from '../errors/word-bank-not-found.error';
import { InvalidUUIDError } from '../errors/invalid-uuid.error';
import { validate as isUuid } from 'uuid';

export class EntryServiceImpl implements EntryService {
  constructor(
    private entryRepository: EntryRepository,
    private wordBankRepository: WordBankRepository,
  ) {}

  async create(entry: NewEntryDTO): Promise<Entry> {
    const existingEntry = await this.entryRepository.findByTerm(entry.term);
    if (existingEntry) {
      throw new DuplicateEntryError(entry.term);
    }
    const entity = Entry.create(entry);
    return this.entryRepository.save(entity);
  }

  async findById(id: string): Promise<Entry | undefined> {
    if (!isUuid(id)) {
      throw new InvalidUUIDError(id);
    }
    return this.entryRepository.findById(id);
  }

  async findByTerm(term: string): Promise<Entry | undefined> {
    return this.entryRepository.findByTerm(term);
  }

  async findAllFromWordBank(wordBankId: string): Promise<Entry[]> {
    if (!isUuid(wordBankId)) {
      throw new InvalidUUIDError(wordBankId);
    }
    const existingWordBank = await this.wordBankRepository.findById(wordBankId);
    if (!existingWordBank) {
      throw new WordBankNotFoundError(wordBankId);
    }
    return this.entryRepository.findAllFromWordBank(wordBankId);
  }

  async getDefinition(
    entryId: string,
    definitionId: string,
  ): Promise<Definition> {
    if (!isUuid(entryId)) {
      throw new InvalidUUIDError(entryId);
    }
    if (!isUuid(definitionId)) {
      throw new InvalidUUIDError(definitionId);
    }
    const existingEntry = await this.entryRepository.findById(entryId);
    if (!existingEntry) {
      throw new EntryNotFoundError(entryId);
    }

    const existingDefinition = existingEntry.definitions.find(
      (definition) => definition.id.getValue() === definitionId,
    );
    if (!existingDefinition) {
      throw new DefinitionNotFoundError(definitionId);
    }

    return existingDefinition;
  }

  async addDefinition(
    entryId: string,
    definition: NewDefinitionDTO,
  ): Promise<Definition> {
    if (!isUuid(entryId)) {
      throw new InvalidUUIDError(entryId);
    }
    const entry = await this.entryRepository.findById(entryId);
    if (!entry) {
      throw new EntryNotFoundError(entryId);
    }

    const newDefinition = this.entryRepository.addDefinition(
      entryId,
      Definition.create(definition),
    );

    return newDefinition;
  }

  async updateDefinition(
    entryId: string,
    definitionId: string,
    definition: NewDefinitionDTO,
  ): Promise<Definition> {
    if (!isUuid(entryId)) {
      throw new InvalidUUIDError(entryId);
    }
    if (!isUuid(definitionId)) {
      throw new InvalidUUIDError(definitionId);
    }
    const existingEntry = await this.entryRepository.findById(entryId);
    if (!existingEntry) {
      throw new EntryNotFoundError(entryId);
    }

    const existingDefinition = existingEntry.definitions.find(
      (definition) => definition.id.getValue() === definitionId,
    );
    if (!existingDefinition) {
      throw new DefinitionNotFoundError(definitionId);
    }

    const updatedDefinition = await this.entryRepository.updateDefinition(
      entryId,
      definitionId,
      Definition.create({
        ...definition,
        id: definitionId,
      }),
    );

    return updatedDefinition;
  }

  async removeDefinition(entryId: string, definitionId: string): Promise<void> {
    if (!isUuid(entryId)) {
      throw new InvalidUUIDError(entryId);
    }
    if (!isUuid(definitionId)) {
      throw new InvalidUUIDError(definitionId);
    }
    const existingEntry = await this.entryRepository.findById(entryId);
    if (!existingEntry) {
      throw new EntryNotFoundError(entryId);
    }

    const existingDefinition = existingEntry.definitions.find(
      (definition) => definition.id.getValue() === definitionId,
    );
    if (!existingDefinition) {
      throw new DefinitionNotFoundError(definitionId);
    }

    await this.entryRepository.removeDefinition(definitionId);
  }

  async remove(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new InvalidUUIDError(id);
    }
    const entry = await this.entryRepository.findById(id);
    if (!entry) {
      throw new EntryNotFoundError(id);
    }
    return this.entryRepository.remove(id);
  }
}
