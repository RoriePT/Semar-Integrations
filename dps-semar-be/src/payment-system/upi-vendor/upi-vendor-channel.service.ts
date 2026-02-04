import { Injectable, NotFoundException } from '@nestjs/common';
import { Payin } from 'src/payin/entities/payin.entity';
import { OrderStatus } from 'src/utils/enum/enum';
import { UpiVendorQueueService } from 'src/upi-vendor/upi-vendor-queue.service';

@Injectable()
export class UpiVendorChannelService {
  constructor(private readonly upiVendorQueueService: UpiVendorQueueService) {}

  async getPayPage(systemOrderId: string, environment = 'live') {
    const upiData = await this.upiVendorQueueService.getCurrentUpi();

    if (!upiData)
      throw new NotFoundException('No UPI vendors available at the moment');

    return {
      url: `${process.env.PAYMENT_PAGE_BASE_URL}/upi-vendor-gateway/${systemOrderId}?environment=${environment}`,
      upiDetails: {
        upiId: upiData.upiId,
        title: upiData.title,
        mobile: upiData.mobile,
        beneficiaryName: upiData.beneficiaryName,
        isBusinessUpi: upiData.isBusinessUpi,
        vendorId: upiData.vendorId,
        vendorName: upiData.vendorName,
        commissionRate: upiData.vendorCommissionRate,
        upiEntityId: upiData.upiEntityId,
      },
    };
  }

  async getPaymentStatus(payinOrder: Payin) {
    let status = 'PENDING';

    if (payinOrder.status === OrderStatus.SUBMITTED) status = 'SUBMITTED';

    if (payinOrder.status === OrderStatus.COMPLETE) status = 'SUCCESS';

    if (payinOrder.status === OrderStatus.FAILED) status = 'FAILED';

    return { status };
  }
}
