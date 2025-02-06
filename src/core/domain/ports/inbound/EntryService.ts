import { Entry } from '../../model/entities/Entry';
import { NewEntryDTO } from 'src/core/shared/dto/NewEntryDTO';
import { NewDefinitionDTO } from 'src/core/shared/dto/NewDefinitionDTO';
import { UpdatedDefinitionDTO } from 'src/core/shared/dto/UpdatedDefinitionDTO';
import { Definition } from '../../model/entities/Definition';

export interface EntryService {
  create(entry: NewEntryDTO): Promise<Entry>;
  findById(id: string): Promise<Entry | undefined>;
  findByTerm(term: string): Promise<Entry | undefined>;
  findAllFromWordBank(wordBankId: string): Promise<Entry[]>;
  getDefinition(entryId: string, definitionId: string): Promise<Definition>;
  addDefinition(
    entryId: string,
    definition: NewDefinitionDTO,
  ): Promise<Definition>;
  updateDefinition(
    entryId: string,
    definitionId: string,
    definition: UpdatedDefinitionDTO,
  ): Promise<Definition>;
  removeDefinition(entryId: string, definitionId: string): Promise<void>;
  remove(id: string): Promise<void>;
}
