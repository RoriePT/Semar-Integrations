import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderType, UserTypeForTransactionUpdates } from 'src/utils/enum/enum';
import { Identity } from 'src/identity/entities/identity.entity';
import { SystemConfigService } from 'src/system-config/system-config.service';
import {
  calculateServiceAmountForMerchant,
  roundOffAmount,
} from 'src/utils/utils';
import { TransactionUpdatesService } from './transaction-updates.service';
import { Team } from 'src/team/entities/team.entity';

@Injectable()
export class TransactionUpdatesPayinService {
  constructor(
    @InjectRepository(TransactionUpdate)
    private readonly transactionUpdateRepository: Repository<TransactionUpdate>,
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    private readonly systemConfigService: SystemConfigService,
    private readonly transactionUpdatesService: TransactionUpdatesService,
  ) {}

  async processReferralMerchant(
    referralList,
    orderType,
    orderAmount,
    orderDetails,
    systemOrderId,
  ) {
    const getAgentRates = (referee) => {
      return {
        payin: referee.agentCommissions?.payinCommissionRate || 0,
        payout: referee.agentCommissions?.payoutCommissionRate || 0,
      };
    };

    let currentOrderSystemProfit = 0;
    let merchantAgentsBaseAmount = 0;

    for (let i = 0; i < referralList.length; i++) {
      const element = referralList[i];
      const prevElement = i > 0 ? referralList[i - 1] : null;

      const identity = await this.identityRepository.findOne({
        where: { email: element.identity.email },
      });

      const isMerchant = element.isMerchant;
      const userType = isMerchant
        ? UserTypeForTransactionUpdates.MERCHANT_BALANCE
        : UserTypeForTransactionUpdates.AGENT_BALANCE;
      const isAgentOf = prevElement
        ? prevElement?.firstName + ' ' + prevElement?.lastName
        : null;
      const name = element.firstName + ' ' + element.lastName;

      const rate = isMerchant
        ? element.payinServiceRate?.percentageAmount
        : getAgentRates(prevElement).payin;

      const rateText = isMerchant
        ? `${rate || 0}% of ₹${roundOffAmount(orderAmount)}`
        : `${rate || 0}% of ₹${roundOffAmount(merchantAgentsBaseAmount)}`;

      const absoluteAmount = isMerchant
        ? element.payinServiceRate?.absoluteAmount
        : 0;

      const amount = isMerchant
        ? calculateServiceAmountForMerchant(
            orderAmount,
            element.payinServiceRate,
          )
        : (merchantAgentsBaseAmount / 100) * rate;

      const before = element.balance;

      const after = isMerchant
        ? before + orderAmount - amount
        : before + amount;

      const transactionUpdate = {
        orderType,
        userType,
        rate,
        rateText,
        absoluteAmount,
        amount: roundOffAmount(amount),
        before: roundOffAmount(before),
        after: roundOffAmount(after),
        name,
        isAgentOf,
        payinOrder: orderDetails,
        systemOrderId,
        user: identity,
      };

      await this.transactionUpdateRepository.save(transactionUpdate);

      if (isMerchant) {
        const { payinSystemProfitRate } =
          await this.systemConfigService.findLatest();
        currentOrderSystemProfit = (amount / 100) * payinSystemProfitRate;
        merchantAgentsBaseAmount = roundOffAmount(currentOrderSystemProfit);
      } else {
        currentOrderSystemProfit -= amount;
      }
    }

    await this.addSystemProfit({
      orderDetails,
      orderType,
      systemOrderId,
      amount: roundOffAmount(currentOrderSystemProfit),
    });
  }

  async processReferralMember(
    referralList,
    orderType,
    orderAmount,
    orderDetails,
    systemOrderId,
  ) {
    const getAgentRates = (referee) => {
      return {
        payin: referee.agentCommissions?.payinCommissionRate,
        payout: referee.agentCommissions?.payoutCommissionRate,
        topup: referee.agentCommissions?.topupCommissionRate,
      };
    };

    const getMemberRates = async (teamId) => {
      let team;
      if (teamId) team = await this.teamRepository.findOneBy({ teamId });
      if (team?.teamPayinCommissionRate > 0)
        return team?.teamPayinCommissionRate;

      return (await this.systemConfigService.findLatest())
        ?.payinCommissionRateForMember;
    };

    const { amount: merchantFee } =
      await this.transactionUpdateRepository.findOne({
        where: {
          systemOrderId,
          userType: UserTypeForTransactionUpdates.MERCHANT_BALANCE,
        },
      });

    const { payinSystemProfitRate } =
      await this.systemConfigService.findLatest();

    let remainingMerchantFee =
      merchantFee - (merchantFee / 100) * payinSystemProfitRate;
    let systemProfit = remainingMerchantFee;

    for (let i = 0; i < referralList.length; i++) {
      const element = referralList[i];
      const prevElement = i > 0 ? referralList[i - 1] : null;
      const isAgent = i !== 0;

      const identity = await this.identityRepository.findOne({
        where: { email: element.identity.email },
      });

      const name = element?.firstName + ' ' + element?.lastName;
      const userType = UserTypeForTransactionUpdates.MEMBER_QUOTA;

      const rate = !isAgent
        ? await getMemberRates(element?.teamId)
        : getAgentRates(prevElement).payin;

      const amount = (merchantFee / 100) * rate;

      const rateText = `${rate || 0}% of ₹${roundOffAmount(merchantFee)}`;

      const before = element.quota;

      const after = !isAgent ? before - orderAmount + amount : before + amount;

      const isAgentOf = prevElement
        ? prevElement?.firstName + ' ' + prevElement?.lastName
        : null;
      const isAgentMember = isAgent;

      const transactionUpdate = {
        orderType,
        userType,
        rate,
        rateText,
        amount: roundOffAmount(amount),
        before: roundOffAmount(before),
        after: roundOffAmount(after),
        name,
        isAgentOf,
        isAgentMember,
        payinOrder: orderDetails,
        systemOrderId,
        user: identity,
      };

      await this.transactionUpdateRepository.save(transactionUpdate);
      systemProfit -= amount;

      // insert row twice for agents - quota and balance
      if (isAgent) {
        const agentTransactionUpdate = {
          orderType,
          userType: UserTypeForTransactionUpdates.MEMBER_BALANCE,
          rate,
          rateText,
          amount: roundOffAmount(amount),
          before: element.balance,
          after: element.balance + amount,
          name,
          isAgentOf,
          isAgentMember,
          payinOrder: orderDetails,
          systemOrderId,
          user: identity,
        };

        await this.transactionUpdateRepository.save(agentTransactionUpdate);
      }
    }

    if (systemProfit > 0)
      await this.addSystemProfit({
        orderDetails,
        orderType,
        systemOrderId,
        amount: systemProfit,
        forUpdate: true,
      });
  }

  async processForGateway(orderDetails, gatewayServiceRate) {
    const { amount: merchantFee } =
      await this.transactionUpdateRepository.findOne({
        where: {
          systemOrderId: orderDetails.systemOrderId,
          userType: UserTypeForTransactionUpdates.MERCHANT_BALANCE,
        },
      });

    const { payinSystemProfitRate } =
      await this.systemConfigService.findLatest();

    let remainingMerchantFee =
      merchantFee - (merchantFee / 100) * payinSystemProfitRate;
    let systemProfit = remainingMerchantFee;

    const gatewayFeeDeducted = (orderDetails.amount / 100) * gatewayServiceRate;

    await this.transactionUpdateRepository.save({
      orderType: OrderType.PAYIN,
      userType: UserTypeForTransactionUpdates.GATEWAY_FEE,
      systemOrderId: orderDetails.systemOrderId,
      name: orderDetails.paymentMode,
      rate: gatewayServiceRate,
      amount: roundOffAmount(gatewayFeeDeducted),
      before: 0,
      after: 0,
      payinOrder: orderDetails,
    });

    systemProfit -= gatewayFeeDeducted;

    await this.addSystemProfit({
      orderDetails,
      orderType: OrderType.PAYIN,
      systemOrderId: orderDetails.systemOrderId,
      amount: roundOffAmount(systemProfit),
      forUpdate: true,
    });
  }

  async processForUpiVendor(orderDetails) {
    const { amount: merchantFee } =
      await this.transactionUpdateRepository.findOne({
        where: {
          systemOrderId: orderDetails.systemOrderId,
          userType: UserTypeForTransactionUpdates.MERCHANT_BALANCE,
        },
      });

    const { payinSystemProfitRate } =
      await this.systemConfigService.findLatest();

    const remainingMerchantFee =
      merchantFee - (merchantFee / 100) * payinSystemProfitRate;
    let systemProfit = remainingMerchantFee;

    // Calculate UPI vendor commission from total payin amount
    const upiVendorCommissionRate = orderDetails.upiVendor?.commissionRate || 0;
    const upiVendorCommission =
      (orderDetails.amount / 100) * upiVendorCommissionRate;

    // Get UPI vendor identity if not already loaded
    let upiVendorIdentity = orderDetails.upiVendor?.identity;
    if (!upiVendorIdentity && orderDetails.upiVendor?.id) {
      // Fetch UPI vendor with identity relation
      const upiVendorWithIdentity = await this.identityRepository
        .createQueryBuilder('identity')
        .leftJoinAndSelect('identity.upiVendor', 'upiVendor')
        .where('upiVendor.id = :upiVendorId', {
          upiVendorId: orderDetails.upiVendor.id,
        })
        .getOne();
      upiVendorIdentity = upiVendorWithIdentity;
    }

    // Calculate cumulative commission: before = total commission before this order
    // Use TransactionUpdate createdAt for comparison, and include all completed transactions
    const previousCommissionsResult =
      await this.transactionUpdateRepository
        .createQueryBuilder('tu')
        .select('COALESCE(SUM(tu.amount), 0)', 'total')
        .leftJoin('tu.payinOrder', 'payin')
        .where('tu.userType = :userType', {
          userType: UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
        })
        .andWhere('payin.upiVendor = :upiVendorId', {
          upiVendorId: orderDetails.upiVendor.id,
        })
        .andWhere('tu.systemOrderId != :currentSystemOrderId', {
          currentSystemOrderId: orderDetails.systemOrderId,
        })
        .andWhere('tu.pending = :pending', { pending: false })
        .getRawOne();

    const commissionBefore = roundOffAmount(
      parseFloat(previousCommissionsResult?.total || '0'),
    );
    const commissionAfter = roundOffAmount(
      commissionBefore + upiVendorCommission,
    );

    // Save UPI vendor commission entry
    await this.transactionUpdateRepository.save({
      orderType: OrderType.PAYIN,
      userType: UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
      systemOrderId: orderDetails.systemOrderId,
      name:
        orderDetails.upiVendor?.firstName +
        ' ' +
        orderDetails.upiVendor?.lastName,
      rate: upiVendorCommissionRate,
      rateText: `${upiVendorCommissionRate || 0}% of ₹${roundOffAmount(orderDetails.amount)}`,
      amount: roundOffAmount(upiVendorCommission),
      before: commissionBefore,
      after: commissionAfter,
      payinOrder: orderDetails,
      user: upiVendorIdentity || null,
    });

    systemProfit -= upiVendorCommission;

    // Update system profit after deducting UPI vendor commission
    await this.addSystemProfit({
      orderDetails,
      orderType: OrderType.PAYIN,
      systemOrderId: orderDetails.systemOrderId,
      amount: roundOffAmount(systemProfit),
      forUpdate: true,
    });
  }

  async addSystemProfit({
    orderDetails,
    orderType,
    systemOrderId,
    amount,
    forUpdate = false,
  }) {
    const systemProfitExists = await this.transactionUpdateRepository.findOne({
      where: {
        userType: UserTypeForTransactionUpdates.SYSTEM_PROFIT,
        systemOrderId,
      },
      relations: ['payinOrder'],
    });
    if (systemProfitExists)
      await this.transactionUpdateRepository.remove(systemProfitExists);

    const { systemProfit, payinSystemProfitRate } =
      await this.systemConfigService.findLatest();

    let beforeProfit = systemProfit;

    const currentAmount = forUpdate
      ? amount + systemProfitExists.amount
      : amount;

    await this.transactionUpdateRepository.save({
      orderType,
      userType: UserTypeForTransactionUpdates.SYSTEM_PROFIT,
      rate: payinSystemProfitRate,
      before: roundOffAmount(beforeProfit),
      amount: roundOffAmount(currentAmount),
      after: roundOffAmount(beforeProfit + currentAmount),
      payinOrder: orderDetails,
      systemOrderId,
    });
  }

  async create({
    orderDetails,
    orderType,
    userId,
    systemOrderId,
    gatewayServiceRate = 0,
    forMember = false,
    forGateway = false,
    forUpiVendor = false,
  }) {
    const { amount } = orderDetails;

    if (forGateway) {
      await this.processForGateway(orderDetails, gatewayServiceRate);
      return;
    }

    if (forUpiVendor) {
      await this.processForUpiVendor(orderDetails);
      return;
    }

    if (forMember) {
      const referralList =
        await this.transactionUpdatesService.getMemberAgentsLine(userId);

      await this.processReferralMember(
        referralList,
        orderType,
        amount,
        orderDetails,
        systemOrderId,
      );
    } else {
      const referralList =
        await this.transactionUpdatesService.getMerchantAgentsLine(userId);

      await this.processReferralMerchant(
        referralList,
        orderType,
        amount,
        orderDetails,
        systemOrderId,
      );
    }

    return HttpStatus.CREATED;
  }
}
