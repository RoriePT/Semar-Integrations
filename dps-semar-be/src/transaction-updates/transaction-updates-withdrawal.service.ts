import { roundOffAmount } from 'src/utils/utils';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GatewayName,
  UserTypeForTransactionUpdates,
  WithdrawalMadeOn,
  PaymentType,
} from 'src/utils/enum/enum';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { ChannelSettings } from 'src/gateway/entities/channel-settings.entity';

@Injectable()
export class TransactionUpdatesWithdrawalService {
  constructor(
    @InjectRepository(TransactionUpdate)
    private readonly transactionUpdateRepository: Repository<TransactionUpdate>,
    @InjectRepository(ChannelSettings)
    private readonly channelSettingsRepository: Repository<ChannelSettings>,
    private readonly systemConfigService: SystemConfigService,
  ) {}

  async addSystemProfit(orderDetails, orderType, systemOrderId, failed = false) {
    const systemProfitExists = await this.transactionUpdateRepository.findOne({
      where: {
        userType: UserTypeForTransactionUpdates.SYSTEM_PROFIT,
        systemOrderId,
      },
      relations: ['withdrawalOrder'],
    });
    if (systemProfitExists)
      await this.transactionUpdateRepository.remove(systemProfitExists);

    const transactionUpdateEntries =
      await this.transactionUpdateRepository.find({
        where: {
          systemOrderId,
          pending: false,
        },
        relations: ['withdrawalOrder'],
      });

    const systemConfig = await this.systemConfigService.findLatest();

    let beforeProfit = systemConfig.systemProfit || 0;
    let amount = 0;

    // If withdrawal failed or was rejected, system profit should be 0
    if (!failed) {
      transactionUpdateEntries.forEach((row) => {
        if (
          row.userType === UserTypeForTransactionUpdates.MERCHANT_BALANCE ||
          row.userType === UserTypeForTransactionUpdates.AGENT_BALANCE
        )
          amount = row.amount;

        if (row.userType === UserTypeForTransactionUpdates.GATEWAY_FEE)
          amount -= row.amount;
      });
    }

    let after = beforeProfit + amount;

    await this.transactionUpdateRepository.save({
      orderType,
      userType: UserTypeForTransactionUpdates.SYSTEM_PROFIT,
      before: roundOffAmount(beforeProfit),
      amount: roundOffAmount(amount),
      after: roundOffAmount(after),
      withdrawalOrder: orderDetails,
      systemOrderId,
      pending: false,
    });
  }

  async create({
    orderDetails,
    orderType,
    systemOrderId,
    userRole,
    withdrawalMadeOn,
    user,
    gatewayName = GatewayName.PHONEPE,
    failed = false,
  }) {
    const mapUserType = {
      MERCHANT: UserTypeForTransactionUpdates.MERCHANT_BALANCE,
      AGENT: UserTypeForTransactionUpdates.AGENT_BALANCE,
      gateway_fee: UserTypeForTransactionUpdates.GATEWAY_FEE,
    };

    let rate = 0;
    let rateText = '';
    let amount = 0;

    // For GATEWAY_FEE entry, calculate gateway fee from channel settings
    if (userRole === UserTypeForTransactionUpdates.GATEWAY_FEE) {
      if (gatewayName && orderDetails.channel) {
        const channelSetting = await this.channelSettingsRepository.findOne({
          where: {
            gatewayName,
            type: PaymentType.OUTGOING,
            channelName: orderDetails.channel,
          },
        });

        if (channelSetting) {
          rate = channelSetting.upstreamFee;
          rateText = `${rate}% of ₹${orderDetails?.amount}`;
          amount = (orderDetails.amount / 100) * rate; // Gateway fee from channel settings
        } else {
          // If no channel setting found, gateway fee is 0
          rate = 0;
          rateText = `0% of ₹${orderDetails?.amount}`;
          amount = 0;
        }
      } else {
        rate = 0;
        rateText = `0% of ₹${orderDetails?.amount}`;
        amount = 0;
      }
    } else {
      // For merchant/agent balance, calculate service fee
      rate = user?.withdrawalServiceRate || user?.withdrawalRate || 0;
      rateText = `${rate}% of ₹${orderDetails?.amount}`;
      amount = (orderDetails.amount / 100) * rate; // Withdrawal service rate
    }

    // Calculate gateway fee for merchant/agent balance deduction (only for GATEWAY withdrawals)
    let gatewayFee = 0;
    if (
      withdrawalMadeOn === WithdrawalMadeOn.GATEWAY &&
      userRole !== UserTypeForTransactionUpdates.GATEWAY_FEE &&
      gatewayName &&
      orderDetails.channel
    ) {
      const channelSetting = await this.channelSettingsRepository.findOne({
        where: {
          gatewayName,
          type: PaymentType.OUTGOING,
          channelName: orderDetails.channel,
        },
      });

      if (channelSetting) {
        const gatewayServiceRate = channelSetting.upstreamFee;
        gatewayFee = (orderDetails.amount / 100) * gatewayServiceRate;
      }
    }

    const before = user.balance;
    // For merchant/agent: deduct withdrawal amount + service fee + gateway fee
    // For gateway_fee entry: before and after are 0 (it's just a record)
    const after =
      userRole === UserTypeForTransactionUpdates.GATEWAY_FEE
        ? 0
        : user.balance - (orderDetails.amount + amount + gatewayFee);

    const transactionUpdate = {
      orderType,
      userType: mapUserType[userRole],
      rate,
      rateText,
      amount: roundOffAmount(amount),
      before: roundOffAmount(before),
      after: failed ? roundOffAmount(before) : roundOffAmount(after),
      name:
        userRole === UserTypeForTransactionUpdates.GATEWAY_FEE
          ? gatewayName
          : `${user.firstName} ${user.lastName}`,
      withdrawalOrder: orderDetails,
      systemOrderId,
      user: orderDetails.user,
      pending: false,
    };

    await this.transactionUpdateRepository.save(transactionUpdate);

    await this.addSystemProfit(orderDetails, orderType, systemOrderId, failed);

    return HttpStatus.CREATED;
  }
}
