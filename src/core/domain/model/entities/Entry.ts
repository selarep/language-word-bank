import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Definition } from './Definition';
import { NewEntryDTO } from '../../../shared/dto/NewEntryDTO';
import { Id } from '../../../shared/domain/valueObjects/Id';
import { Pronunciation } from '../valueObjects/Pronunciation';
import { NewDefinitionDTO } from '../../../shared/dto/NewDefinitionDTO';

export class Entry extends AggregateRoot {
  term: string;
  pronunciation: Pronunciation;
  definitions: Definition[];

  private constructor() {
    super();
  }

  static create(entry: NewEntryDTO): Entry {
    const entryCreated = this.builder()
      .id(entry.id || Id.generate())
      .term(entry.term)
      .pronunciation(entry.pronunciation)
      .definitions(
        entry.definitions
          ? entry.definitions.map((definition: NewDefinitionDTO) =>
              Definition.create(definition),
            )
          : [],
      )
      .build();

    return entryCreated;
  }

  static builder() {
    return new this.EntryBuilder();
  }

  private static EntryBuilder = class {
    readonly entry = new Entry();

    constructor() {}

    id(id: Id | string) {
      this.entry.id = typeof id === 'string' ? new Id(id) : id;
      return this;
    }

    term(term: string) {
      this.entry.term = term;
      return this;
    }

    pronunciation(pronunciation: Pronunciation | string) {
      this.entry.pronunciation =
        typeof pronunciation === 'string'
          ? new Pronunciation(pronunciation)
          : pronunciation;
      return this;
    }

    definitions(definitions: Definition[] | NewDefinitionDTO[]) {
      this.entry.definitions = definitions.every(
        (def) => def instanceof Definition,
      )
        ? definitions
        : definitions.map((def: NewDefinitionDTO) => Definition.create(def));
      return this;
    }

    build() {
      return this.entry;
    }
  };
}
