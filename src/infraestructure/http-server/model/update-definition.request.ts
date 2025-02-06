import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateDefinitionRequest {
  @IsOptional()
  @IsString()
  definitionText?: string;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  examples?: string[];
}
