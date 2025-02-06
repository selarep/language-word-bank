import { UpdatedDefinitionDTO } from 'src/core/shared/dto/UpdatedDefinitionDTO';
import { Entity } from '../../../shared/domain/Entity';
import { Id } from '../../../shared/domain/valueObjects/Id';
import { NewDefinitionDTO } from '../../../shared/dto/NewDefinitionDTO';

export class Definition extends Entity {
  definitionText: string;
  examples: string[];

  private constructor() {
    super();
  }

  static create(definition: NewDefinitionDTO): Definition {
    const definitionCreated = this.builder()
      .id(definition.id || Id.generate())
      .text(definition.definitionText)
      .examples(definition.examples)
      .build();

    return definitionCreated;
  }

  update(definition: UpdatedDefinitionDTO): Definition {
    this.definitionText = definition.definitionText || this.definitionText;
    this.examples = definition.examples || this.examples;
    return this;
  }

  static builder() {
    return new this.DefinitionBuilder();
  }

  private static DefinitionBuilder = class {
    readonly definition = new Definition();

    constructor() {}

    id(id: Id | string) {
      this.definition.id = typeof id === 'string' ? new Id(id) : id;
      return this;
    }

    text(text: string) {
      this.definition.definitionText = text;
      return this;
    }

    examples(examples: string[]) {
      this.definition.examples = examples;
      return this;
    }

    build() {
      return this.definition;
    }
  };
}
