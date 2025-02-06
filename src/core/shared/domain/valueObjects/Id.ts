import { ValueObject } from '../ValueObject';
import {
  version as uuidVersion,
  validate as uuidValidate,
  v4 as uuidv4,
} from 'uuid';

export class Id extends ValueObject<string> {
  constructor(id: string) {
    super(id, `Invalid UUID Id: ${id}`);
  }

  validate() {
    return uuidValidate(this.getValue()) && uuidVersion(this.getValue()) === 4;
  }

  static generate() {
    return new Id(uuidv4());
  }
}
