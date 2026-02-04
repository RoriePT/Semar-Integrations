import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundRecord } from './entities/fund-record.entity';
import { FundRecordService } from './fund-record.service';
import { FundRecordController } from './fund-record.controller';
import { Withdrawal } from 'src/withdrawal/entities/withdrawal.entity';
import { Payout } from 'src/payout/entities/payout.entity';
import { SystemConfigModule } from 'src/system-config/system-config.module';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import { AgentModule } from 'src/agent/agent.module';
import { Identity } from 'src/identity/entities/identity.entity';
import { Member } from 'src/member/entities/member.entity';
import { MemberModule } from 'src/member/member.module';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { MerchantModule } from 'src/merchant/merchant.module';
import { Agent } from 'src/agent/entities/agent.entity';
import { Submerchant } from 'src/sub-merchant/entities/sub-merchant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FundRecord,
      TransactionUpdate,
      Identity,
      Member,
      Merchant,
      Agent,
      Submerchant,
      Withdrawal,
      Payout,
    ]),
    MemberModule,
    AgentModule,
    MerchantModule,
    SystemConfigModule,
  ],
  controllers: [FundRecordController],
  providers: [FundRecordService],
  exports: [FundRecordService],
})
export class FundRecordModule {}
