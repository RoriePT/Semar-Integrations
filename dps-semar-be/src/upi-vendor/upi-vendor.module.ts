import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UpiVendorService } from './upi-vendor.service';
import { UpiVendorQueueService } from './upi-vendor-queue.service';
import { UpiVendorController } from './upi-vendor.controller';

import { UpiVendor } from './entities/upi-vendor.entity';

import { IdentityModule } from 'src/identity/identity.module';
import { Upi } from 'src/channel/entity/upi.entity';
import { Payin } from 'src/payin/entities/payin.entity';
import { Settlement } from 'src/settlement/entities/settlement.entity';
import { SystemConfigModule } from 'src/system-config/system-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UpiVendor, Upi, Payin, Settlement]),
    IdentityModule,
    SystemConfigModule,
  ],
  controllers: [UpiVendorController],
  providers: [UpiVendorService, UpiVendorQueueService],
  exports: [UpiVendorService, UpiVendorQueueService],
})
export class UpiVendorModule {}
