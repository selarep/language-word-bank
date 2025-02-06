import { IsOptional, IsString } from 'class-validator';

export class UpdateWordBankRequest {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
