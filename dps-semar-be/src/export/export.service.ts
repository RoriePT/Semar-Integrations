import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExportDto } from './dto/create-export.dto';
import { AdminService } from 'src/admin/admin.service';
import { MemberService } from 'src/member/member.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { SubMerchantService } from 'src/sub-merchant/sub-merchant.service';
import { AgentService } from 'src/agent/agent.service';
import { TopupAdminService } from 'src/topup/topup-admin.service';
import { PayinAdminService } from 'src/payin/payin-admin.service';
import { PayoutAdminService } from 'src/payout/payout-admin.service';
import { WithdrawalAdminService } from 'src/withdrawal/withdrawal-admin.service';
import { TransactionUpdatesService } from 'src/transaction-updates/transaction-updates.service';
import { FundRecordService } from 'src/fund-record/fund-record.service';
import { PayinMerchantService } from 'src/payin/payin-merchant.service';
import { PayoutMerchantService } from 'src/payout/payout-merchant.service';
import { UpiVendorService } from 'src/upi-vendor/upi-vendor.service';

@Injectable()
export class ExportService {
  constructor(
    private readonly adminService: AdminService,
    private readonly memberService: MemberService,
    private readonly merchantService: MerchantService,
    private readonly subMerchantService: SubMerchantService,
    private readonly agentService: AgentService,
    private readonly topupAdminService: TopupAdminService,
    private readonly payinAdminService: PayinAdminService,
    private readonly payoutAdminService: PayoutAdminService,
    private readonly withdrawalAdminService: WithdrawalAdminService,
    private readonly transactionUpdatesService: TransactionUpdatesService,
    private readonly fundRecordService: FundRecordService,

    private readonly payinMerchantService: PayinMerchantService,
    private readonly payoutMerchantService: PayoutMerchantService,
    private readonly upiVendorService: UpiVendorService,
  ) {}

  async create(createExportDto: CreateExportDto, user) {
    const { startDate, endDate, tableName } = createExportDto;

    switch (tableName) {
      // Admin
      case 'admin':
        return await this.adminService.exportRecords(startDate, endDate);
      case 'member':
        return await this.memberService.exportRecords(startDate, endDate);
      case 'merchant':
        return await this.merchantService.exportRecords(startDate, endDate);
      case 'submerchant':
        return await this.subMerchantService.exportRecords(startDate, endDate);
      case 'agent':
        return await this.agentService.exportRecords(startDate, endDate);
      case 'payin':
        return await this.payinAdminService.exportRecords(startDate, endDate);
      case 'payout':
        return await this.payoutAdminService.exportRecords(startDate, endDate);
      case 'withdrawal':
        return await this.withdrawalAdminService.exportRecords(
          startDate,
          endDate,
        );
      case 'topup':
        return await this.topupAdminService.exportRecords(startDate, endDate);

      case 'commissions':
        return await this.transactionUpdatesService.exportRecords(
          startDate,
          endDate,
        );

      case 'fund-record':
        return await this.fundRecordService.exportRecords(startDate, endDate);

      case 'fund-record-merchant':
        return await this.fundRecordService.exportRecordsMerchant(
          startDate,
          endDate,
          user,
        );

      // Merchant
      case 'payin-merchant':
        return await this.payinMerchantService.exportRecords(
          startDate,
          endDate,
          user,
        );
      case 'payout-merchant':
        return await this.payoutMerchantService.exportRecords(
          startDate,
          endDate,
          user,
        );

      case 'upi-vendor':
        return await this.upiVendorService.exportRecords(startDate, endDate);

      default:
        throw new NotFoundException('Invalid table name!');
    }
  }
}
