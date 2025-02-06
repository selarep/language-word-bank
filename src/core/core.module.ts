import { DynamicModule, Module, Type } from '@nestjs/common';
import { EntryRepository } from './domain/ports/outbound/EntryRepository';
import { WordBankRepository } from './domain/ports/outbound/WordBankRepository';
import { WordBankServiceImpl } from './application/services/WordBankServiceImpl';
import { EntryServiceImpl } from './application/services/EntryServiceImpl';

export type CoreModuleOptions = {
  modules: Type[];
  adapters: {
    entryRepository: Type<EntryRepository>;
    wordBankRepository: Type<WordBankRepository>;
  };
};

// Application services
export const WORD_BANK_SERVICE = 'WORD_BANK_SERVICE';
export const ENTRY_SERVICE = 'ENTRY_SERVICE';

@Module({})
export class CoreModule {
  static register(options: CoreModuleOptions): DynamicModule {
    const { adapters, modules } = options;
    const { entryRepository, wordBankRepository } = adapters;

    const WordBankServiceProvider = {
      provide: WORD_BANK_SERVICE,
      useFactory(
        wordBankRepository: WordBankRepository,
        entryRepository: EntryRepository,
      ) {
        return new WordBankServiceImpl(wordBankRepository, entryRepository);
      },
      inject: [wordBankRepository, entryRepository],
    };

    const EntryServiceProvider = {
      provide: ENTRY_SERVICE,
      useFactory(
        entryRepository: EntryRepository,
        wordBankRepository: WordBankRepository,
      ) {
        return new EntryServiceImpl(entryRepository, wordBankRepository);
      },
      inject: [entryRepository, wordBankRepository],
    };

    return {
      module: CoreModule,
      global: true,
      imports: [...modules],
      providers: [WordBankServiceProvider, EntryServiceProvider],
      exports: [WORD_BANK_SERVICE, ENTRY_SERVICE],
    };
  }
}
