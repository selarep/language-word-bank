import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { CreateDefinitionRequest } from './create-definition.request';

export class CreateEntryRequest {
  @IsString()
  term: string;

  @IsString()
  pronunciation: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateDefinitionRequest)
  definitions: CreateDefinitionRequest[];
}
