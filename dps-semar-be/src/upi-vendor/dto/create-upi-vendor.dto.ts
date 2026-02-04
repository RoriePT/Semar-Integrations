import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsNumber,
} from 'class-validator';

import { IsValidPassword } from 'src/utils/decorators/validPassword.decorator';
import { UpiVendorUpiDto } from './upi-vendor-upi.dto';

export class CreateUpiVendorDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Invalid email address!' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsValidPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean;

  @IsOptional()
  @IsNumber()
  commissionRate?: number;

  @IsOptional()
  @IsString()
  settlementUpiId?: string;

  @IsOptional()
  @Type(() => UpiVendorUpiDto)
  @ValidateNested({ each: true })
  upiIds: UpiVendorUpiDto[];
}
