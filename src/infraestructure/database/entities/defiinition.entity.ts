import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntryEntity } from './entry.entity';

@Entity({ name: 'definitions' })
export class DefinitionEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'definition_id' })
  definitionId: string;

  @Column({ name: 'definition_text' })
  definitionText: string;

  @Column('text', { array: true })
  examples: string[];

  @ManyToOne(() => EntryEntity, (entry) => entry.definitions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entry_id' })
  entry: EntryEntity;
}
