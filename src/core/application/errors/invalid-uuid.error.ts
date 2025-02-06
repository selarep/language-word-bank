export class InvalidUUIDError extends Error {
  constructor(uuid: string) {
    super(`ID '${uuid}' is not a valid UUID v4.`);
    this.name = 'InvalidUUIDError';
  }
}
