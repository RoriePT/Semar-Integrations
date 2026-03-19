import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsString()
  disbursement_merchant_id?: string;

  @IsOptional()
  @IsString()
  disbursement_creator_api_key?: string;

  @IsOptional()
  @IsString()
  disbursement_creator_merchant_key?: string;

  @IsOptional()
  @IsString()
  disbursement_approver_api_key?: string;

  @IsOptional()
  @IsString()
  disbursement_approver_merchant_key?: string;

  @IsOptional()
  @IsString()
  sandbox_disbursement_merchant_id?: string;

  @IsOptional()
  @IsString()
  sandbox_disbursement_creator_api_key?: string;

  @IsOptional()
  @IsString()
  sandbox_disbursement_creator_merchant_key?: string;

  @IsOptional()
  @IsString()
  sandbox_disbursement_approver_api_key?: string;

  @IsOptional()
  @IsString()
  sandbox_disbursement_approver_merchant_key?: string;
}

export class UpdateMidtransDto extends PartialType(CreateMidtransDto) {}
