import { ValueObject } from '../../../shared/domain/ValueObject';

export class Pronunciation extends ValueObject<string> {
  constructor(pronunciation: string) {
    super(pronunciation, `Invalid phonetical transcription: ${pronunciation}`);
  }

  validate() {
    return typeof this.getValue() === 'string' && this.getValue().length > 0;
  }
}
