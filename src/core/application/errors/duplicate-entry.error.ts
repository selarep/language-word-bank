export class DuplicateEntryError extends Error {
  constructor(term: string) {
    super(`Entry with term '${term}' exists.`);
    this.name = 'DuplicateEntryError';
  }
}
