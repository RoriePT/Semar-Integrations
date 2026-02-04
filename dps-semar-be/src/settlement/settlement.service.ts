import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Settlement } from './entities/settlement.entity';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import { UpiVendor } from 'src/upi-vendor/entities/upi-vendor.entity';
import { Upi } from 'src/channel/entity/upi.entity';
import { OrderStatus, OrderType } from 'src/utils/enum/enum';
import uniqid from 'uniqid';
import { plainToInstance } from 'class-transformer';
import { SettlementResponseDto } from './dto/settlement-response.dto';
import { TopupChannelDto } from './dto/get-topup-channels.dto';
import {
  PaginateRequestDto,
  parseEndDate,
  parseStartDate,
} from 'src/utils/dtos/paginate.dto';
import { roundOffAmount } from 'src/utils/utils';
import { FundRecordService } from 'src/fund-record/fund-record.service';
import { paginateAndClamp } from 'src/utils/pagination.util';

@Injectable()
export class SettlementService {
  constructor(
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,
    @InjectRepository(UpiVendor)
    private readonly upiVendorRepository: Repository<UpiVendor>,
    @InjectRepository(Upi)
    private readonly upiRepository: Repository<Upi>,
    private readonly fundRecordService: FundRecordService,
  ) {}

  async getTopupChannels(vendorId: number) {
    const vendor = await this.upiVendorRepository.findOne({
      where: { id: vendorId },
      relations: ['identity', 'identity.upi'],
    });

    if (!vendor) throw new NotFoundException('UPI Vendor not found');

    // Get all pending settlements (SUBMITTED status) for this vendor
    const pendingSettlements = await this.settlementRepository.find({
      where: {
        upiVendor: { id: vendorId },
        status: OrderStatus.SUBMITTED,
      },
      relations: ['upi'],
    });

    // Create a map of UPI ID to total pending settlement amount
    const pendingAmountByUpiId = pendingSettlements.reduce((acc, settlement) => {
      const upiId = settlement.upi.id;
      if (!acc[upiId]) {
        acc[upiId] = 0;
      }
      acc[upiId] += settlement.paidAmount || 0;
      return acc;
    }, {} as Record<number, number>);

    const upiIds = vendor.identity.upi
      .filter((upi) => upi.isUpiVendor && upi.enabled)
      .map((upi) => {
        const totalSettlementAmount = upi.settlementAmount || 0;
        const pendingAmount = pendingAmountByUpiId[upi.id] || 0;
        // Subtract pending settlement amount from total
        const availableSettlementAmount = Math.max(
          0,
          totalSettlementAmount - pendingAmount,
        );

        return {
          upiId: upi.id,
          upiIdValue: upi.upiId,
          title: upi.title,
          settlementAmount: roundOffAmount(availableSettlementAmount),
          pendingSettlementAmount: roundOffAmount(pendingAmount),
          beneficiaryName: upi.beneficiaryName,
          mobile: upi.mobile,
          email: upi.email,
        };
      });

    return plainToInstance(TopupChannelDto, upiIds);
  }

  async create(createSettlementDto: CreateSettlementDto, vendorId: number) {
    const { upiId, paidAmount, transactionId, topupChannelDetails } =
      createSettlementDto;

    // Fetch UPI vendor
    const vendor = await this.upiVendorRepository.findOne({
      where: { id: vendorId },
      relations: ['identity', 'identity.upi'],
    });

    if (!vendor) throw new NotFoundException('UPI Vendor not found');

    // Fetch UPI ID
    const upi = await this.upiRepository.findOne({
      where: { id: upiId },
      relations: ['identity'],
    });

    if (!upi) throw new NotFoundException('UPI ID not found');

    // Verify UPI belongs to this vendor
    if (upi.identity.id !== vendor.identity.id) {
      throw new BadRequestException('This UPI ID does not belong to you');
    }

    const settlementAmount = upi.settlementAmount || 0;

    if (settlementAmount <= 0) {
      throw new BadRequestException(
        'No settlement amount available for this UPI',
      );
    }

    if (paidAmount > settlementAmount) {
      throw new BadRequestException(
        'Paid amount cannot be greater than settlement amount',
      );
    }

    const remainingAmount = settlementAmount - paidAmount;

    // Create settlement order
    const settlement = await this.settlementRepository.save({
      systemOrderId: `SETTLEMENT-${uniqid()}`.toUpperCase(),
      settlementAmount: settlementAmount,
      paidAmount: paidAmount,
      remainingAmount: remainingAmount,
      status: OrderStatus.SUBMITTED,
      transactionId: transactionId,
      topupChannelDetails: topupChannelDetails || null,
      upiVendor: vendor,
      upi: upi,
    });

    // Note: Settlement amount is NOT deducted here
    // It will be deducted only when admin approves the settlement

    return {
      success: true,
      message: 'Settlement order created successfully',
      data: plainToInstance(SettlementResponseDto, settlement),
    };
  }

  async paginate(vendorId: number, paginateDto: PaginateRequestDto) {
    const query = this.settlementRepository.createQueryBuilder('settlement');

    query.leftJoinAndSelect('settlement.upiVendor', 'upiVendor');
    query.leftJoinAndSelect('settlement.upi', 'upi');

    query.where('settlement.upiVendor = :vendorId', { vendorId });

    const search = paginateDto.search;
    const pageSize = paginateDto.pageSize;
    const pageNumber = paginateDto.pageNumber;
    const sortBy = paginateDto.sortBy;

    if (search) {
      query.andWhere(
        `(settlement.systemOrderId ILIKE :search OR settlement.transactionId ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    if (paginateDto.startDate && paginateDto.endDate) {
      const startDate = parseStartDate(paginateDto.startDate);
      const endDate = parseEndDate(paginateDto.endDate);

      query.andWhere('settlement.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (sortBy)
      sortBy === 'latest'
        ? query.orderBy('settlement.createdAt', 'DESC')
        : query.orderBy('settlement.createdAt', 'ASC');

    const { rows, meta } = await paginateAndClamp(query, {
      pageNumber,
      pageSize,
    });

    const dtos = plainToInstance(SettlementResponseDto, rows);

    return {
      data: dtos,
      total: meta.total,
      page: meta.page,
      pageSize: meta.pageSize,
      totalPages: meta.totalPages,
      startRecord: meta.startRecord,
      endRecord: meta.endRecord,
    };
  }

  async paginateSubmitted(vendorId: number, paginateDto: PaginateRequestDto) {
    const query = this.settlementRepository.createQueryBuilder('settlement');

    query.leftJoinAndSelect('settlement.upiVendor', 'upiVendor');
    query.leftJoinAndSelect('settlement.upi', 'upi');

    query.where('settlement.upiVendor = :vendorId', { vendorId });
    query.andWhere('settlement.status = :status', {
      status: OrderStatus.SUBMITTED,
    });

    const search = paginateDto.search;
    const pageSize = paginateDto.pageSize;
    const pageNumber = paginateDto.pageNumber;
    const sortBy = paginateDto.sortBy;

    if (search) {
      query.andWhere(
        `(settlement.systemOrderId ILIKE :search OR settlement.transactionId ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    if (paginateDto.startDate && paginateDto.endDate) {
      const startDate = parseStartDate(paginateDto.startDate);
      const endDate = parseEndDate(paginateDto.endDate);

      query.andWhere('settlement.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (sortBy)
      sortBy === 'latest'
        ? query.orderBy('settlement.createdAt', 'DESC')
        : query.orderBy('settlement.createdAt', 'ASC');

    const { rows, meta } = await paginateAndClamp(query, {
      pageNumber,
      pageSize,
    });

    const dtos = plainToInstance(SettlementResponseDto, rows);

    return {
      data: dtos,
      total: meta.total,
      page: meta.page,
      pageSize: meta.pageSize,
      totalPages: meta.totalPages,
      startRecord: meta.startRecord,
      endRecord: meta.endRecord,
    };
  }

  async findOne(id: number, vendorId?: number) {
    const settlement = await this.settlementRepository.findOne({
      where: { id },
      relations: ['upiVendor', 'upi'],
    });

    if (!settlement) throw new NotFoundException('Settlement not found');

    // Skip vendor check if vendorId is not provided (admin access)
    if (vendorId && settlement.upiVendor?.id !== vendorId) {
      throw new BadRequestException('This settlement does not belong to you');
    }

    return plainToInstance(SettlementResponseDto, settlement);
  }

  async updateStatus(
    id: number,
    updateDto: UpdateSettlementDto,
    vendorId: number,
  ) {
    const settlement = await this.settlementRepository.findOne({
      where: { id },
      relations: ['upiVendor'],
    });

    if (!settlement) throw new NotFoundException('Settlement not found');

    if (settlement.upiVendor?.id !== vendorId) {
      throw new BadRequestException('This settlement does not belong to you');
    }

    await this.settlementRepository.update({ id }, updateDto);

    return HttpStatus.OK;
  }

  async updateStatusAdmin(id: number, updateDto: UpdateSettlementDto) {
    const settlement = await this.settlementRepository.findOne({
      where: { id },
    });

    if (!settlement) throw new NotFoundException('Settlement not found');

    await this.settlementRepository.update({ id }, updateDto);

    return HttpStatus.OK;
  }

  async approveSettlement(id: number) {
    const settlement = await this.settlementRepository.findOne({
      where: { id },
      relations: ['upi', 'upiVendor', 'upiVendor.identity'],
    });

    if (!settlement) throw new NotFoundException('Settlement not found');

    if (settlement.status !== OrderStatus.SUBMITTED) {
      throw new BadRequestException(
        'Only submitted settlements can be approved',
      );
    }

    // Get current settlement amount before deduction
    const currentSettlementAmount = settlement.upi.settlementAmount || 0;
    const newSettlementAmount = roundOffAmount(
      currentSettlementAmount - settlement.paidAmount,
    );

    // Update settlement status to COMPLETE
    await this.settlementRepository.update(id, {
      status: OrderStatus.COMPLETE,
    });

    // Deduct paid amount from UPI's settlement amount
    await this.upiRepository.update(settlement.upi.id, {
      settlementAmount: newSettlementAmount >= 0 ? newSettlementAmount : 0,
    });

    // Create fund record entry for settlement
    await this.fundRecordService.createFundRecordForSettlement({
      settlement,
      beforeAmount: currentSettlementAmount,
      afterAmount: newSettlementAmount >= 0 ? newSettlementAmount : 0,
    });

    return {
      success: true,
      message: 'Settlement approved successfully',
    };
  }

  async rejectSettlement(id: number) {
    const settlement = await this.settlementRepository.findOne({
      where: { id },
    });

    if (!settlement) throw new NotFoundException('Settlement not found');

    if (settlement.status !== OrderStatus.SUBMITTED) {
      throw new BadRequestException(
        'Only submitted settlements can be rejected',
      );
    }

    // Update settlement status to FAILED
    await this.settlementRepository.update(id, {
      status: OrderStatus.FAILED,
    });

    return {
      success: true,
      message: 'Settlement rejected successfully',
    };
  }
}
