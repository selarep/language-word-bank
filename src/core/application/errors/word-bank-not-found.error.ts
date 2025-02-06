export class WordBankNotFoundError extends Error {
  constructor(wordBankId: string) {
    super(`WordBank with ID '${wordBankId}' not found.`);
    this.name = 'WordBankNotFoundError';
  }
}
