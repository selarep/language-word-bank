import { DomainException } from '../../error/DomainException';
import { Id } from './Id';

describe('IdValueObject', () => {
  it('Must create an Id() object with UUID v4', () => {
    const uuid = '4cb1e732-27be-42a9-b673-83324e199e52';
    const id = new Id(uuid);

    expect(id.getValue()).toBe(uuid);
  });

  it('Must throw a DomainException when creating an Id() object with an invalid UUID', () => {
    expect(() => new Id('invalid-uuid')).toThrow(
      new DomainException(`Invalid UUID Id: invalid-uuid`),
    );
  });
});
