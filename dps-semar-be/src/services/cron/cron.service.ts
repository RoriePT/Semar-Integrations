import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PayinService } from 'src/payin/payin.service';
import { PayoutService } from 'src/payout/payout.service';
import { TopupService } from 'src/topup/topup.service';
import { WithdrawalService } from 'src/withdrawal/withdrawal.service';
import { FundRecordService } from 'src/fund-record/fund-record.service';
import { PaymentSystemService } from 'src/payment-system/payment-system.service';

@Injectable()
export class CronService {
  constructor(
    private readonly topupService: TopupService,
    private readonly payoutService: PayoutService,

    private readonly payinService: PayinService,
    private readonly withdrawalService: WithdrawalService,
    private readonly fundRecordService: FundRecordService,
    private readonly paymetSystemService: PaymentSystemService,
  ) {}

  //   '0 */15 * * * *';
  @Cron(CronExpression.EVERY_5_SECONDS)
  handleTopupOrders() {
    this.topupService.checkAndCreate();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handlePendingGatewayPayouts() {
    try {
      this.payoutService.fetchPendingPayoutsAndUpdateStatus();
      this.withdrawalService.fetchPendingWithdrawalsAndUpdateStatus();
    } catch (error) {
      console.log({ error });
    }
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  handleSandboxPayinCron() {
    this.payinService.removeOneDayOldSandboxPayins();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleFrozenAmountCron() {
    try {
      await this.fundRecordService.createFrozenAmountRecords();
    } catch (error) {
      console.error('Error in handleFrozenAmountCron:', error);
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleAssignedPayins() {
    try {
      await this.paymetSystemService.updatePendingPayinOrdersStatus();
      await this.payinService.expireOldOrders();
      await this.payoutService.expireOldOrders();
    } catch (error) {
      console.log({ error });
    }
  }
}
