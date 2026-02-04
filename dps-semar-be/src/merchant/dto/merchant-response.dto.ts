import { Exclude, Expose, Transform } from 'class-transformer';
import { PayinMode } from '../entities/payinMode.entity';
import { TransformPayinModeDetails } from 'src/utils/decorators/payin-mode.decorator';

import { ChannelProfileDto } from 'src/utils/dtos/channel-profile.dto';
import { roundOffAmount } from 'src/utils/utils';
import { AmountRangePayinMode } from '../entities/amountRangePayinMode.entity';
import { ProportionalPayinMode } from '../entities/proportionalPayinMode.entity';
import { ServiceRateType } from 'src/utils/enum/enum';
import { Agent } from 'src/agent/entities/agent.entity';

@Exclude()
export class MerchantResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.identity.email, { toClassOnly: true })
  email: string;

  @Expose()
  @TransformPayinModeDetails()
  payinModeDetails: PayinMode;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;

  @Expose()
  id: number;

  @Expose()
  enabled: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  businessName: string;

  @Expose()
  referralCode: string;

  @Expose()
  integrationId: string;

  @Expose()
  apiKey: string;

  @Expose()
  businessUrl: string;

  @Expose()
  gst: string;

  @Expose()
  allowMemberChannelsPayin: boolean;

  @Expose()
  allowPgBackupForPayin: boolean;

  @Expose()
  allowMemberChannelsPayout: boolean;

  @Expose()
  allowPgBackupForPayout: boolean;

  @Expose()
  enableUpiVendorGateway: boolean;

  @Expose()
  payinServiceRate: ServiceRateType;

  @Expose()
  payoutServiceRate: ServiceRateType;

  @Expose()
  withdrawalServiceRate: number;

  @Expose()
  minPayout: number;

  @Expose()
  maxPayout: number;

  @Expose()
  minWithdrawal: number;

  @Expose()
  maxWithdrawal: number;

  @Expose()
  payinMode: 'DEFAULT' | 'PROPORTIONAL' | 'AMOUNT RANGE';

  @Expose()
  @Transform(({ obj }) => obj.identity?.ips?.map((ip) => ip.value), {
    toClassOnly: true,
  })
  ips: string[];

  @Expose()
  @Transform(
    ({ obj }) => {
      const channelProfile = {
        upi: obj.identity.upi,
        eWallet: obj.identity.eWallet,
        netBanking: obj.identity.netBanking,
      };
      return channelProfile;
    },
    { toClassOnly: true },
  )
  channelProfile: ChannelProfileDto;

  @Expose()
  payinChannels: number[];

  @Expose()
  payoutChannels: number[];

  @Expose()
  numberOfRangesOrRatio?: number;

  @Expose()
  @Transform(({ obj }) => roundOffAmount(obj.balance), {
    toClassOnly: true,
  })
  balance: number;

  @Expose()
  withdrawalsCompleted: number;

  @Expose()
  frozenAmount: number;

  @Expose()
  @Transform(
    ({ obj }) => {
      return (
        obj?.payinModeDetails?.amountRangeRange.map((item) => ({
          ...item,
          lower: parseInt(item.lower),
          upper: parseInt(item.upper),
        })) || []
      );
    },
    { toClassOnly: true },
  )
  amountRangeRange: AmountRangePayinMode[];

  @Expose()
  @Transform(
    ({ obj }) => {
      return (
        obj?.payinModeDetails?.proportionalRange.map((item) => ({
          ratio: item.ratio,
          gateway: item.gateway,
        })) || []
      );
    },
    { toClassOnly: true },
  )
  propotionRatio: ProportionalPayinMode[];

  @Expose()
  organizationId: string;

  @Expose()
  @Transform(
    ({ obj }) => {
      return {
        id: obj?.agent?.id || 0,
        name: obj?.agent?.firstName
          ? obj?.agent?.firstName + ' ' + obj?.agent?.lastName
          : '',
      };
    },
    { toClassOnly: true },
  )
  agent: Agent;

  @Expose()
  agentPayinCommissionRate: number;

  @Expose()
  agentPayoutCommissionRate: number;

  @Expose()
  enablePayins: number;

  @Expose()
  enablePayouts: number;

  @Expose()
  upiVendorAutoVerifyThreshold: number;
}
