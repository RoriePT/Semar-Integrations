import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ChannelName, GatewayName } from 'src/utils/enum/enum';

const normalizeChannel = ({ value }) => {
  if (typeof value !== 'string') return value;

  const upper = value.toUpperCase();
  if (upper === 'NET_BANKING') return ChannelName.BANKING;
  if (upper === 'E_WALLET') return ChannelName.E_WALLET;
  if (upper === 'UPI') return ChannelName.UPI;
  if (upper === 'QRIS') return ChannelName.QRIS;

  return value;
};

class UserInfoDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  mobileNumber: string;
}

export class GetPaymentPageApiModeDto {
  @IsNumber()
  amount: number;

  @IsString()
  orderId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => UserInfoDto)
  user: UserInfoDto;

  @IsEnum(['live', 'sandbox'], {
    message: 'environment must be either live or sandbox!',
  })
  environment: 'live' | 'sandbox';

  @ValidateIf((o) => o.environment === 'sandbox')
  @IsEnum(GatewayName)
  paymentGateway?: GatewayName;

  @IsOptional()
  @IsString()
  @Matches(/^https:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/, {
    message: 'successUrl must be a valid full HTTPS URL!',
  })
  successUrl?: string;

  @IsOptional()
  @IsString()
  @Matches(/^https:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/, {
    message: 'failureUrl must be a valid full HTTPS URL!',
  })
  failureUrl?: string;

  @IsOptional()
  @IsString()
  @Matches(/^https:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/, {
    message: 'webhookUrl must be a valid full HTTPS URL!',
  })
  webhookUrl?: string;

  @IsEnum(ChannelName)
  @Transform(normalizeChannel)
  paymentMethod: ChannelName;
}

export class AssignPaymentGatewayDto {
  @IsString()
  integrationId: string;

  @IsString()
  systemOrderId: string;

  @IsEnum(['sandbox', 'live'])
  environment: 'sandbox' | 'live';

  @ValidateIf((o) => o.environment === 'sandbox')
  @IsEnum([
    'member',
    'phonepe',
    'razorpay',
    'payu',
    'cashfree',
    'doku',
    'midtrans',
    'xendit',
    'upi-vendor',
  ])
  paymentGateway?:
    | 'member'
    | 'phonepe'
    | 'razorpay'
    | 'payu'
    | 'cashfree'
    | 'doku'
    | 'midtrans'
    | 'xendit'
    | 'upi-vendor';
}

export class GetPayPageDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  amount?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(GatewayName)
  gateway: GatewayName;

  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  integrationId?: string;

  @IsOptional()
  @IsEnum(ChannelName)
  channelName?: ChannelName;

  @IsOptional()
  @IsEnum(['live', 'sandbox'])
  environment?: 'live' | 'sandbox';
}
