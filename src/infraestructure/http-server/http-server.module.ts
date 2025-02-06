import { Module } from '@nestjs/common';
import { WordBankController } from './controllers/wordBank.controller';
import { EntryController } from './controllers/entry.controller';

@Module({
  controllers: [WordBankController, EntryController],
})
export class HttpServerModule {}
