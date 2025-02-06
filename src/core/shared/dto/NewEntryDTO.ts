import { NewDefinitionDTO } from './NewDefinitionDTO';

export interface NewEntryDTO {
  id?: string;
  term: string;
  pronunciation: string;
  definitions?: NewDefinitionDTO[];
}
