import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { ChannelName } from 'src/utils/enum/enum';

const normalizeChannel = ({ value }) => {
  if (typeof value !== 'string') return value;

  const upper = value.toUpperCase();
  if (upper === 'NET_BANKING') return ChannelName.BANKING;
  if (upper === 'E_WALLET') return ChannelName.E_WALLET;
  if (upper === 'UPI') return ChannelName.UPI;
  if (upper === 'QRIS') return ChannelName.QRIS;

  return value;
};

export class CreatePaymentOrderDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsOptional()
  @IsString()
  userEmail?: string;

  @IsOptional()
  @IsString()
  userMobileNumber?: string;

  @IsString()
  @IsNotEmpty()
  integrationId: string;

  @IsEnum(ChannelName)
  @Transform(normalizeChannel)
  channel: ChannelName;

  @IsEnum(['sandbox', 'live'])
  environment: 'sandbox' | 'live';

  @IsOptional()
  @IsEnum([
    'member',
    'razorpay',
    'phonepe',
    'payu',
    'cashfree',
    'doku',
    'midtrans',
    'xendit',
    'upi-vendor',
  ])
  paymentMethod?:
    | 'member'
    | 'razorpay'
    | 'phonepe'
    | 'payu'
    | 'cashfree'
    | 'doku'
    | 'midtrans'
    | 'xendit'
    | 'upi-vendor';

  @IsOptional()
  @Matches(/^https:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/, {
    message: 'successUrl must be a valid full HTTPS URL!',
  })
  successUrl?: string;

  @IsOptional()
  @Matches(/^https:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/, {
    message: 'failureUrl must be a valid full HTTPS URL!',
  })
  failureUrl?: string;

  @IsOptional()
  @Matches(/^https:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/, {
    message: 'webhookUrl must be a valid full HTTPS URL!',
  })
  webhookUrl?: string;

  @IsOptional()
  @IsEnum(['sdk', 'api'])
  mode?: 'sdk' | 'api';
}

export class CreatePaymentOrderDtoAdmin {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsOptional()
  merchantId: number;

  @IsNotEmpty()
  @IsOptional()
  memberId: number;

  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  userMobileNumber: string;

  @IsEnum(ChannelName)
  @Transform(normalizeChannel)
  channel: ChannelName;
}

export class CreatePaymentOrderSandboxDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsOptional()
  @IsString()
  userEmail?: string;

  @IsOptional()
  @IsString()
  userMobileNumber?: string;

  @IsEnum(ChannelName)
  @Transform(normalizeChannel)
  channel: ChannelName;

  @IsNumber()
  merchantId: number;

  @IsEnum([
    'member',
    'razorpay',
    'phonepe',
    'payu',
    'cashfree',
    'doku',
    'midtrans',
    'xendit',
    'upi-vendor',
  ])
  paymentMethod:
    | 'member'
    | 'razorpay'
    | 'phonepe'
    | 'payu'
    | 'cashfree'
    | 'doku'
    | 'midtrans'
    | 'xendit'
    | 'upi-vendor';

  @IsOptional()
  @Matches(/^https:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/, {
    message: 'successUrl must be a valid full HTTPS URL!',
  })
  successUrl?: string;

  @IsOptional()
  @Matches(/^https:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/, {
    message: 'failureUrl must be a valid full HTTPS URL!',
  })
  failureUrl?: string;

  @IsOptional()
  @Matches(/^https:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/, {
    message: 'webhookUrl must be a valid full HTTPS URL!',
  })
  webhookUrl?: string;

  @IsOptional()
  @IsEnum(['sdk', 'api'])
  mode?: 'sdk' | 'api';
}
