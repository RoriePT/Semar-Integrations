import { Module } from '@nestjs/common';
import { BulletinController } from './bulletin.controller';
import { BulletinService } from './bulletin.service';
import { TopupModule } from 'src/topup/topup.module';
import { PayoutModule } from 'src/payout/payout.module';
import { PayinModule } from 'src/payin/payin.module';
import { UpiVendorModule } from 'src/upi-vendor/upi-vendor.module';
import { NotificationModule } from 'src/notification/notification.module';
import { AlertModule } from 'src/alert/alert.module';
import { SettlementModule } from 'src/settlement/settlement.module';

@Module({
  imports: [
    TopupModule,
    PayoutModule,
    PayinModule,
    UpiVendorModule,
    NotificationModule,
    AlertModule,
    SettlementModule,
  ],
  controllers: [BulletinController],
  providers: [BulletinService],
})
export class BulletinModule {}
