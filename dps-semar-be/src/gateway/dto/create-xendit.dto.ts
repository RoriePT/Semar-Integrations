import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateXenditDto {
  @IsNotEmpty()
  @IsBoolean()
  incoming: boolean;

  @IsNotEmpty()
  @IsBoolean()
  outgoing: boolean;

  @IsNotEmpty()
  @IsString()
  secret_key: string;

  @IsNotEmpty()
  @IsString()
  sandbox_secret_key: string;
}

export class UpdateXenditDto extends PartialType(CreateXenditDto) {}
