import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Definition } from 'src/core/domain/model/entities/Definition';
import { Entry } from 'src/core/domain/model/entities/Entry';
import { EntryRepository } from 'src/core/domain/ports/outbound/EntryRepository';
import { Repository } from 'typeorm';
import { DefinitionEntity } from '../database/entities/defiinition.entity';
import { EntryEntity } from '../database/entities/entry.entity';

@Injectable()
export class EntryRepositoryAdapter implements EntryRepository {
  constructor(
    @InjectRepository(EntryEntity)
    private readonly entryRepository: Repository<EntryEntity>,
    @InjectRepository(DefinitionEntity)
    private readonly definitionRepository: Repository<DefinitionEntity>,
  ) {}

  async findById(id: string): Promise<Entry | undefined> {
    const dbEntity = await this.entryRepository.findOne({
      where: { entryId: id },
      relations: ['definitions'],
    });
    if (!dbEntity) {
      return undefined;
    }

    return this.mapDbToEntry(dbEntity);
  }

  async findByTerm(term: string): Promise<Entry | undefined> {
    const dbEntity = await this.entryRepository.findOne({
      where: { term },
      relations: ['definitions'],
    });
    if (!dbEntity) {
      return undefined;
    }

    return this.mapDbToEntry(dbEntity);
  }

  async findAllFromWordBank(wordBankId: string): Promise<Entry[]> {
    const dbEntries = await this.entryRepository
      .createQueryBuilder('entry')
      .innerJoin('entry.wordBanks', 'wordBank')
      .innerJoinAndSelect('entry.definitions', 'definition')
      .where('wordBank.wordBankId = :wordBankId', { wordBankId })
      .getMany();

    return dbEntries.map((dbEntry) => this.mapDbToEntry(dbEntry));
  }

  async addDefinition(
    entryId: string,
    definition: Definition,
  ): Promise<Definition> {
    const definitionEntity = this.mapDefinitionToDb(definition);
    definitionEntity.entry = { entryId } as EntryEntity;

    await this.definitionRepository.save(definitionEntity);

    return definition;
  }

  async updateDefinition(
    entryId: string,
    definitionId: string,
    definition: Definition,
  ): Promise<Definition> {
    const definitionEntity = await this.definitionRepository.findOneBy({
      definitionId,
    });

    if (!definitionEntity) {
      throw new Error('Definition not found');
    }

    definitionEntity.definitionText = definition.definitionText;
    definitionEntity.examples = definition.examples;
    definitionEntity.entry = { entryId } as EntryEntity;

    await this.definitionRepository.save(definitionEntity);

    return definition;
  }

  async removeDefinition(definitionId: string): Promise<void> {
    await this.definitionRepository.delete({ definitionId });
  }

  async save(entry: Entry): Promise<Entry> {
    const entryEntity = this.mapEntryToDb(entry);

    await this.entryRepository.save(entryEntity);

    return entry;
  }

  async remove(id: string): Promise<void> {
    await this.entryRepository.delete({ entryId: id });
  }

  private mapDefinitionToDb(definition: Definition): DefinitionEntity {
    const definitionEntity = new DefinitionEntity();
    definitionEntity.definitionId = definition.id.getValue();
    definitionEntity.definitionText = definition.definitionText;
    definitionEntity.examples = definition.examples;

    return definitionEntity;
  }

  private mapEntryToDb(entry: Entry): EntryEntity {
    const entryEntity = new EntryEntity();
    entryEntity.entryId = entry.id.getValue();
    entryEntity.term = entry.term;
    entryEntity.pronunciation = entry.pronunciation.getValue();

    return entryEntity;
  }

  private mapDbToDefinition(dbEntity: DefinitionEntity): Definition {
    return Definition.create({
      id: dbEntity.definitionId,
      ...dbEntity,
    });
  }

  private mapDbToEntry(dbEntity: EntryEntity): Entry {
    const entry = Entry.create({
      id: dbEntity.entryId,
      ...dbEntity,
    });

    entry.definitions = dbEntity.definitions.map((definition) =>
      this.mapDbToDefinition(definition),
    );

    return entry;
  }
}
