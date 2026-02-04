import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { MerchantModule } from 'src/merchant/merchant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { PayinMode } from 'src/merchant/entities/payinMode.entity';
import { EndUserModule } from 'src/end-user/end-user.module';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { Payin } from 'src/payin/entities/payin.entity';
import { EmailModule } from 'src/services/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Merchant, EndUser, Payin]),
    MerchantModule,
    PayinMode,
    EndUserModule,
    EmailModule,
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptModule {}
