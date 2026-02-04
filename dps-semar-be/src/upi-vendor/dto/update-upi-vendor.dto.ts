import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUpiVendorDto } from './create-upi-vendor.dto';

export class UpdateUpiVendorDto extends PartialType(CreateUpiVendorDto) {
  @IsOptional()
  @IsBoolean()
  updateLoginCredentials?: boolean;
}
