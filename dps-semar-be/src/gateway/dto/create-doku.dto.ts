import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateDokuDto {
  @IsNotEmpty()
  @IsBoolean()
  incoming: boolean;

  @IsNotEmpty()
  @IsBoolean()
  outgoing: boolean;

  @IsNotEmpty()
  @IsString()
  merchant_id: string;

  @IsNotEmpty()
  @IsString()
  client_id: string;

  @IsNotEmpty()
  @IsString()
  secret_key: string;

  @IsNotEmpty()
  @IsString()
  sandbox_merchant_id: string;

  @IsNotEmpty()
  @IsString()
  sandbox_client_id: string;

  @IsNotEmpty()
  @IsString()
  sandbox_secret_key: string;
}

export class UpdateDokuDto extends PartialType(CreateDokuDto) {}
