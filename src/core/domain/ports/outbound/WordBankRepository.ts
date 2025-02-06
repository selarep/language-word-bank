import { WordBank } from '../../model/entities/WordBank';

export interface WordBankRepository {
  findById(id: string): Promise<WordBank | undefined>;
  findAll(): Promise<WordBank[]>;
  save(wordBank: WordBank): Promise<WordBank>;
  remove(id: string): Promise<void>;
}
