import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HttpServerModule } from './http-server/http-server.module';
import { EntryRepositoryAdapter } from './adapters/entry.repository.adapter';
import { WordBankRepositoryAdapter } from './adapters/wordBank.repository.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefinitionEntity } from './database/entities/defiinition.entity';
import { EntryEntity } from './database/entities/entry.entity';
import { WordBankEntity } from './database/entities/wordBank.entity';

@Module({
  imports: [
    DatabaseModule,
    HttpServerModule,
    TypeOrmModule.forFeature([DefinitionEntity, EntryEntity, WordBankEntity]),
  ],
  providers: [EntryRepositoryAdapter, WordBankRepositoryAdapter],
  exports: [EntryRepositoryAdapter, WordBankRepositoryAdapter],
})
export class InfraestructureModule {}
