import { IsString } from 'class-validator';

export class CreateWordBankRequest {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
