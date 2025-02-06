import { WordBank } from '../../model/entities/WordBank';
import { NewWordBankDTO } from 'src/core/shared/dto/NewWordBankDTO';
import { UpdatedWordBankDTO } from 'src/core/shared/dto/UpdatedWordBankDTO';

export interface WordBankService {
  create(wordBank: NewWordBankDTO): Promise<WordBank>;
  findById(id: string): Promise<WordBank | undefined>;
  findAll(): Promise<WordBank[]>;
  updateWordBank(
    wordBankId: string,
    updatedWorkBank: UpdatedWordBankDTO,
  ): Promise<WordBank>;
  assignEntry(wordBankId: string, entryId: string): Promise<WordBank>;
  assignEntryByTerm(wordBankId: string, term: string): Promise<WordBank>;
  unassignEntry(wordBankId: string, entryId: string): Promise<WordBank>;
  remove(id: string): Promise<void>;
}
