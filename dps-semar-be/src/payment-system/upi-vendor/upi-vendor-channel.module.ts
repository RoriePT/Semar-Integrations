import { Module } from '@nestjs/common';
import { UpiVendorChannelService } from './upi-vendor-channel.service';
import { UpiVendorModule } from 'src/upi-vendor/upi-vendor.module';

@Module({
  imports: [UpiVendorModule],
  providers: [UpiVendorChannelService],
  exports: [UpiVendorChannelService],
})
export class UpiVendorChannelModule {}
