import { Definition } from '../../model/entities/Definition';
import { Entry } from '../../model/entities/Entry';

export interface EntryRepository {
  findById(id: string): Promise<Entry | undefined>;
  findByTerm(term: string): Promise<Entry | undefined>;
  findAllFromWordBank(wordBankId: string): Promise<Entry[]>;
  addDefinition(entryId: string, definition: Definition): Promise<Definition>;
  updateDefinition(
    entryId: string,
    definitionId: string,
    definition: Definition,
  ): Promise<Definition>;
  removeDefinition(definitionId: string): Promise<void>;
  save(entry: Entry): Promise<Entry>;
  remove(id: string): Promise<void>;
}
