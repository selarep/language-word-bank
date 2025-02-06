import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { InfraestructureModule } from './infraestructure/infraestructure.module';
import { ConfigModule } from '@nestjs/config';
import { EntryRepositoryAdapter } from './infraestructure/adapters/entry.repository.adapter';
import { WordBankRepositoryAdapter } from './infraestructure/adapters/wordBank.repository.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InfraestructureModule,
    CoreModule.register({
      modules: [InfraestructureModule],
      adapters: {
        entryRepository: EntryRepositoryAdapter,
        wordBankRepository: WordBankRepositoryAdapter,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
