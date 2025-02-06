export class DefinitionNotFoundError extends Error {
  constructor(definitionId: string) {
    super(`Definition with ID '${definitionId}' not found.`);
    this.name = 'DefinitionNotFoundError';
  }
}
