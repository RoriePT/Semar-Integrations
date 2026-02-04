import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSettlementDto {
  @IsNumber()
  @IsNotEmpty()
  upiId: number;

  @IsNumber()
  @IsNotEmpty()
  paidAmount: number;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsOptional()
  @IsString()
  topupChannelDetails?: string;
}

