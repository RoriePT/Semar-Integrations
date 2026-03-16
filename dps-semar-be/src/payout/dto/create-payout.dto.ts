import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsNumber,
  IsObject,
  ValidateNested,
  ValidateIf,
  Matches,
  IsOptional,
} from 'class-validator';
import { ChannelName } from 'src/utils/enum/enum';

class UserDetailsDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  mobile: string;
}

class UpiDetailsDto {
  @IsNotEmpty()
  @IsString()
  upiId: string;

  @IsString()
  @IsString()
  mobileNumber: string;
}

class NetBankingDetailsDto {
  @IsNotEmpty()
  @IsString()
  beneficiaryName: string;

  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsString()
  @IsOptional()
  @Matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
    message: 'Invalid IFSC code format',
  })
  ifscCode?: string;

  @IsString()
  @IsOptional()
  bankCode?: string;
}

class EWalletDetailsDto {
  @IsNotEmpty()
  @IsString()
  appName: string;

  @IsNotEmpty()
  @IsString()
  mobileNumber: string;
}

export class CreatePayoutDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNotEmpty({ message: 'Payment Method must not be empty!' })
  @IsEnum([ChannelName.UPI, ChannelName.BANKING, ChannelName.E_WALLET], {
    message:
      'Payment method must be any one value from - UPI, NET_BANKING, E_WALLET',
  })
  paymentMethod: ChannelName;

  @IsObject()
  @Type(() => UserDetailsDto)
  @ValidateNested({ each: true })
  user: UserDetailsDto;

  @ValidateIf((o) => o.paymentMethod === ChannelName.UPI)
  @Type(() => UpiDetailsDto)
  @ValidateNested({ each: true })
  upiDetails: UpiDetailsDto;

  @ValidateIf((o) => o.paymentMethod === ChannelName.BANKING)
  @Type(() => NetBankingDetailsDto)
  @ValidateNested({ each: true })
  netBankingDetails: NetBankingDetailsDto;

  @ValidateIf((o) => o.paymentMethod === ChannelName.E_WALLET)
  @Type(() => EWalletDetailsDto)
  @ValidateNested({ each: true })
  eWalletDetails: EWalletDetailsDto;

  @IsOptional()
  @IsString()
  @Matches(/^https:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/, {
    message: 'webhookUrl must be a valid full HTTPS URL!',
  })
  webhookUrl?: string;
}
