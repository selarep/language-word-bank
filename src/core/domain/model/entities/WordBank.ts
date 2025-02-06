import { Entity } from '../../../shared/domain/Entity';
import { NewWordBankDTO } from '../../../shared/dto/NewWordBankDTO';
import { Id } from '../../../shared/domain/valueObjects/Id';
import { UpdatedWordBankDTO } from 'src/core/shared/dto/UpdatedWordBankDTO';

export class WordBank extends Entity {
  title: string;
  description: string;
  entryIds: string[];

  private constructor() {
    super();
  }

  assignEntry(entryId: string) {
    this.entryIds.push(entryId);
  }

  unassignEntry(entryId: string) {
    this.entryIds = this.entryIds.filter((id) => id !== entryId);
  }

  update(updatedWordBank: UpdatedWordBankDTO) {
    this.title = updatedWordBank.title || this.title;
    this.description = updatedWordBank.description || this.description;
    return this;
  }

  static create(wordBank: NewWordBankDTO): WordBank {
    const wordBankCreated = this.builder()
      .id(wordBank.id || Id.generate())
      .title(wordBank.title)
      .description(wordBank.description)
      .entryIds(wordBank.entryIds || [])
      .build();

    return wordBankCreated;
  }

  static builder() {
    return new this.WordBankBuilder();
  }

  private static WordBankBuilder = class {
    readonly wordBank = new WordBank();

    constructor() {}

    id(id: Id | string) {
      this.wordBank.id = typeof id === 'string' ? new Id(id) : id;
      return this;
    }

    title(title: string) {
      this.wordBank.title = title;
      return this;
    }

    description(description: string) {
      this.wordBank.description = description;
      return this;
    }

    entryIds(entryIds: string[]) {
      this.wordBank.entryIds = entryIds;
      return this;
    }

    build() {
      return this.wordBank;
    }
  };
}
