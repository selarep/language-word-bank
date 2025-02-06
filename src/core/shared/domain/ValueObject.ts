import { DomainException } from '../error/DomainException';

export abstract class ValueObject<T> {
  protected abstract validate(): boolean;

  constructor(
    private value: T,
    errorMessage: string,
  ) {
    if (!this.validate()) throw new DomainException(errorMessage);
  }

  getValue(): T {
    return this.value;
  }

  toJSON(): T {
    return this.value;
  }
}
