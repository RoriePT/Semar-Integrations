import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Merchant } from 'src/merchant/entities/merchant.entity';

export class CreateEndUserDto {
  @IsString()
  name: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsObject()
  upiDetails?: object;

  @IsOptional()
  @IsObject()
  netBankingDetails?: object;

  @IsOptional()
  @IsObject()
  eWalletDetails?: object;

  merchant: Merchant;
}
