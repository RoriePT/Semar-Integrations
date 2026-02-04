import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementService } from './settlement.service';
import { SettlementAdminService } from './settlement-admin.service';
import { SettlementController } from './settlement.controller';
import { Settlement } from './entities/settlement.entity';
import { UpiVendor } from 'src/upi-vendor/entities/upi-vendor.entity';
import { Upi } from 'src/channel/entity/upi.entity';
import { FundRecordModule } from 'src/fund-record/fund-record.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Settlement, UpiVendor, Upi]),
    FundRecordModule,
  ],
  controllers: [SettlementController],
  providers: [SettlementService, SettlementAdminService],
  exports: [SettlementService, SettlementAdminService],
})
export class SettlementModule {}

