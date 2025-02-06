export class EntryNotFoundError extends Error {
  constructor(entryId?: string, term?: string) {
    if (entryId) {
      super(`Entry with ID '${entryId}' not found.`);
      this.name = 'EntryNotFoundError';
    } else if (term) {
      super(`Entry with term '${term}' not found.`);
      this.name = 'EntryNotFoundError';
    } else {
      super('Entry not found.');
      this.name = 'EntryNotFoundError';
    }
  }
}
