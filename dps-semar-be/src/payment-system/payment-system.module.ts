import { Module } from '@nestjs/common';
import { PaymentSystemService } from './payment-system.service';
import { PaymentSystemController } from './payment-system.controller';
import { PhonePeModule } from './phonepe/phonepe.module';
import { RazorpayModule } from './razorpay/razorpay.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { HttpModule } from '@nestjs/axios';
import { Payin } from 'src/payin/entities/payin.entity';
import { PayinModule } from 'src/payin/payin.module';
import { Config } from 'src/channel/entity/config.entity';
import { PaymentSystemUtilService } from './payment-system.util.service';
import { Member } from 'src/member/entities/member.entity';
import { SystemConfigModule } from 'src/system-config/system-config.module';
import { Razorpay } from 'src/gateway/entities/razorpay.entity';
import { Phonepe } from 'src/gateway/entities/phonepe.entity';
import { ChannelSettings } from 'src/gateway/entities/channel-settings.entity';
import { AmountRangePayinMode } from 'src/merchant/entities/amountRangePayinMode.entity';
import { ProportionalPayinMode } from 'src/merchant/entities/proportionalPayinMode.entity';
import { RazorpayService } from './razorpay/razorpay.service';
import { PhonepeService } from 'src/upstream-gateway/phonepe/phonepe.service';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { EndUserModule } from 'src/end-user/end-user.module';
import { SocketModule } from 'src/socket/socket.module';
import { UniqpayModule } from './uniqpay/uniqpay.module';
import { UniqpayService } from './uniqpay/uniqpay.service';
import { MemberChannelModule } from './member/member-channel.module';
import { MemberChannelService } from './member/member-channel.service';
import { UpiVendorChannelModule } from './upi-vendor/upi-vendor-channel.module';
import { UpiVendorChannelService } from './upi-vendor/upi-vendor-channel.service';
import { JwtModule } from 'src/services/jwt/jwt.module';
import { PayinSandbox } from 'src/payin/entities/payin-sandbox.entity';
import { Uniqpay } from 'src/gateway/entities/uniqpay.entity';
import { Identity } from 'src/identity/entities/identity.entity';
import { IdentityModule } from 'src/identity/identity.module';
import { PayuModule } from './payu/payu.module';
import { Payu } from 'src/gateway/entities/payu.entity';
import { PaymentController } from './payment.controller';
import { Payout } from 'src/payout/entities/payout.entity';
import { Cashfree } from 'src/gateway/entities/cashfree.entity';
import { CashfreeModule } from './cashfree/cashfree.module';
import { UpiVendorModule } from 'src/upi-vendor/upi-vendor.module';
import { NotificationModule } from 'src/notification/notification.module';
import { Upi } from 'src/channel/entity/upi.entity';
import { DokuModule } from './doku/doku.module';
import { MidtransModule } from './midtrans/midtrans.module';
import { XenditModule } from './xendit/xendit.module';
import { Doku } from 'src/gateway/entities/doku.entity';
import { Midtrans } from 'src/gateway/entities/midtrans.entity';
import { Xendit } from 'src/gateway/entities/xendit.entity';
import { DokuService } from './doku/doku.service';
import { MidtransService } from './midtrans/midtrans.service';
import { XenditService } from './xendit/xendit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Merchant,
      Payin,
      PayinSandbox,
      Config,
      Payu,
      Member,
      Razorpay,
      Phonepe,
      ChannelSettings,
      AmountRangePayinMode,
      ProportionalPayinMode,
      EndUser,
      Uniqpay,
      Identity,
      Payout,
      Cashfree,
      Upi,
      Doku,
      Midtrans,
      Xendit,
    ]),
    PhonePeModule,
    RazorpayModule,
    UniqpayModule,
    PayuModule,
    HttpModule,
    PayinModule,
    SystemConfigModule,
    EndUserModule,
    SocketModule,
    MemberChannelModule,
    UpiVendorModule,
    UpiVendorChannelModule,
    JwtModule,
    IdentityModule,
    CashfreeModule,
    NotificationModule,
    DokuModule,
    MidtransModule,
    XenditModule,
  ],
  controllers: [PaymentSystemController, PaymentController],
  providers: [
    PaymentSystemService,
    PaymentSystemUtilService,
    RazorpayService,
    PhonepeService,
    UniqpayService,
    MemberChannelService,
    UpiVendorChannelService,
    DokuService,
    MidtransService,
    XenditService,
  ],
  exports: [PaymentSystemService],
})
export class PaymentSystemModule {}
