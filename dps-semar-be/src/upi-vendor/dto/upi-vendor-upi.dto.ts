import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpiVendorUpiDto {
  @IsNotEmpty()
  @IsString()
  upiId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isBusinessUpi?: boolean;

  @IsOptional()
  @IsString()
  tr?: string;
}
