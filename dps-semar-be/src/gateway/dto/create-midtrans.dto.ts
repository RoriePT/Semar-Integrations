import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateMidtransDto {
  @IsNotEmpty()
  @IsBoolean()
  incoming: boolean;

  @IsNotEmpty()
  @IsBoolean()
  outgoing: boolean;

  @IsNotEmpty()
  @IsString()
  server_key: string;

  @IsNotEmpty()
  @IsString()
  client_key: string;

  @IsNotEmpty()
  @IsString()
  sandbox_server_key: string;

  @IsNotEmpty()
  @IsString()
  sandbox_client_key: string;
}

export class UpdateMidtransDto extends PartialType(CreateMidtransDto) {}
