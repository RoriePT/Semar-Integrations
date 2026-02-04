import { Module } from '@nestjs/common';
import { PayinController } from './payin.controller';
import { Payin } from './entities/payin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayinAdminService } from './payin-admin.service';
import { PayinMemberService } from './payin-member.service';
import { PayinMerchantService } from './payin-merchant.service';
import { PayinUpiVendorService } from './payin-upi-vendor.service';
import { TransactionUpdatesModule } from 'src/transaction-updates/transaction-updates.module';
import { PayinService } from './payin.service';
import { EndUserModule } from 'src/end-user/end-user.module';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { IdentityModule } from 'src/identity/identity.module';
import { Identity } from 'src/identity/entities/identity.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { MerchantModule } from 'src/merchant/merchant.module';
import { SystemConfigModule } from 'src/system-config/system-config.module';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import { MemberModule } from 'src/member/member.module';
import { Member } from 'src/member/entities/member.entity';
import { AgentModule } from 'src/agent/agent.module';
import { FundRecordModule } from 'src/fund-record/fund-record.module';
import { NotificationModule } from 'src/notification/notification.module';
import { Submerchant } from 'src/sub-merchant/entities/sub-merchant.entity';
import { AlertModule } from 'src/alert/alert.module';
import { Team } from 'src/team/entities/team.entity';
import { PayinSandbox } from './entities/payin-sandbox.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from 'src/services/jwt/jwt.module';
import { ReceiptModule } from 'src/receipt/receipt.module';
import { UpiVendor } from 'src/upi-vendor/entities/upi-vendor.entity';
import { UpiVendorModule } from 'src/upi-vendor/upi-vendor.module';
import { Upi } from 'src/channel/entity/upi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payin,
      PayinSandbox,
      EndUser,
      Identity,
      Merchant,
      TransactionUpdate,
      Member,
      Submerchant,
      Team,
      UpiVendor,
      Upi,
    ]),
    TransactionUpdatesModule,
    EndUserModule,
    IdentityModule,
    MerchantModule,
    MemberModule,
    AgentModule,
    SystemConfigModule,
    TransactionUpdatesModule,
    FundRecordModule,
    NotificationModule,
    AlertModule,
    HttpModule,
    JwtModule,
    ReceiptModule,
    UpiVendorModule,
  ],
  controllers: [PayinController],
  providers: [
    PayinAdminService,
    PayinMemberService,
    PayinMerchantService,
    PayinUpiVendorService,
    PayinService,
  ],
  exports: [
    PayinAdminService,
    PayinMemberService,
    PayinMerchantService,
    PayinUpiVendorService,
    PayinService,
  ],
})
export class PayinModule {}
