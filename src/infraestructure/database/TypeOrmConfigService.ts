import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DefinitionEntity } from './entities/defiinition.entity';
import { EntryEntity } from './entities/entry.entity';
import { WordBankEntity } from './entities/wordBank.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('POSTGRES_HOST'),
      port: +(this.configService.get<number>('POSTGRES_PORT') ?? 5432),
      username: this.configService.get<string>('POSTGRES_USER'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      database: this.configService.get<string>('POSTGRES_DB'),
      entities: [DefinitionEntity, EntryEntity, WordBankEntity],
      synchronize: false,
    };
  }
}
