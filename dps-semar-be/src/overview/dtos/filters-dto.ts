import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class FiltersDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsEnum(['PAYINS', 'PAYOUTS', 'WITHDRAWALS'])
  @IsOptional()
  mode: 'PAYINS' | 'PAYOUTS' | 'WITHDRAWALS' | null;

  @IsOptional()
  @IsNumber()
  merchantId?: number;

  @IsOptional()
  @IsNumber()
  upiVendorId?: number;
}
