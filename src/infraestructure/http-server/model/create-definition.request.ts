import { IsArray, IsString } from 'class-validator';

export class CreateDefinitionRequest {
  @IsString()
  definitionText: string;

  @IsArray()
  @IsString({
    each: true,
  })
  examples: string[];
}
