import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefinitionEntity } from './defiinition.entity';
import { WordBankEntity } from './wordBank.entity';

@Entity({ name: 'entries' })
export class EntryEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'entry_id' })
  entryId: string;

  @Column()
  term: string;

  @Column()
  pronunciation: string;

  @OneToMany(() => DefinitionEntity, (definition) => definition.entry, {
    eager: true,
  })
  definitions: DefinitionEntity[];

  @ManyToMany(() => WordBankEntity, (wordBank) => wordBank.entries)
  wordBanks: WordBankEntity[];
}
