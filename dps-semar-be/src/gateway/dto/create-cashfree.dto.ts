import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCashfreeDto {
  @IsNotEmpty()
  @IsBoolean()
  incoming: boolean;

  @IsNotEmpty()
  @IsBoolean()
  outgoing: boolean;

  @IsNotEmpty()
  @IsString()
  client_id: string;

  @IsNotEmpty()
  @IsString()
  client_secret: string;

  @IsNotEmpty()
  @IsString()
  payouts_client_id: string;

  @IsNotEmpty()
  @IsString()
  payouts_client_secret: string;

  @IsNotEmpty()
  @IsString()
  sandbox_client_id: string;

  @IsNotEmpty()
  @IsString()
  sandbox_client_secret: string;
}

export class UpdateCashfreeDto extends PartialType(CreateCashfreeDto) {}
