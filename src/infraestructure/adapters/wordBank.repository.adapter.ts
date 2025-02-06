import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordBankEntity } from '../database/entities/wordBank.entity';
import { WordBankRepository } from 'src/core/domain/ports/outbound/WordBankRepository';
import { WordBank } from 'src/core/domain/model/entities/WordBank';
import { Repository } from 'typeorm';
import { EntryEntity } from '../database/entities/entry.entity';

@Injectable()
export class WordBankRepositoryAdapter implements WordBankRepository {
  constructor(
    @InjectRepository(WordBankEntity)
    private readonly wordBankRepository: Repository<WordBankEntity>,
  ) {}

  async findById(id: string): Promise<WordBank | undefined> {
    const dbEntity = await this.wordBankRepository.findOne({
      where: {
        wordBankId: id,
      },
      loadRelationIds: {
        relations: ['entries'],
        disableMixedMap: true,
      },
    });

    if (!dbEntity) {
      return undefined;
    }

    return WordBank.create({
      id: dbEntity.wordBankId,
      entryIds: dbEntity.entries.map((entry) => entry.entryId),
      ...dbEntity,
    });
  }

  async findAll(): Promise<WordBank[]> {
    const dbEntities = await this.wordBankRepository.find({
      loadRelationIds: {
        relations: ['entries'],
        disableMixedMap: true,
      },
    });
    return dbEntities.map((dbEntity) =>
      WordBank.create({
        id: dbEntity.wordBankId,
        ...dbEntity,
      }),
    );
  }

  async save(wordBank: WordBank): Promise<WordBank> {
    const wordBankEntity = new WordBankEntity();
    wordBankEntity.wordBankId = wordBank.id.getValue();
    wordBankEntity.title = wordBank.title;
    wordBankEntity.description = wordBank.description;
    wordBankEntity.entries = wordBank.entryIds.map((id) => ({
      entryId: id,
    })) as EntryEntity[];

    await this.wordBankRepository.save(wordBankEntity);

    return wordBank;
  }

  async remove(id: string): Promise<void> {
    await this.wordBankRepository.delete({ wordBankId: id });
  }
}
