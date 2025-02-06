import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntryEntity } from './entry.entity';

@Entity({ name: 'word_banks' })
export class WordBankEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'word_bank_id' })
  wordBankId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => EntryEntity, (entry) => entry.wordBanks)
  @JoinTable({
    name: 'word_banks_entries',
    joinColumn: { name: 'word_bank_id' },
    inverseJoinColumn: { name: 'entry_id' },
  })
  entries: EntryEntity[];
}
