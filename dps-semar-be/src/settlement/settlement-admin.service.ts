import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginateRequestDto,
  parseEndDate,
  parseStartDate,
} from 'src/utils/dtos/paginate.dto';
import { Settlement } from './entities/settlement.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { SettlementAdminResponseDto } from './dto/settlement-admin-response.dto';
import { paginateAndClamp } from 'src/utils/pagination.util';

@Injectable()
export class SettlementAdminService {
  constructor(
    @InjectRepository(Settlement)
    private settlementRepository: Repository<Settlement>,
  ) {}

  async paginateSettlements(paginateRequestDto: PaginateRequestDto) {
    const {
      search,
      pageSize,
      pageNumber,
      startDate,
      endDate,
      sortBy,
      filterStatusArray,
    } = paginateRequestDto;

    const queryBuilder = this.settlementRepository
      .createQueryBuilder('settlement')
      .leftJoinAndSelect('settlement.upiVendor', 'upiVendor')
      .leftJoinAndSelect('upiVendor.identity', 'identity')
      .leftJoinAndSelect('settlement.upi', 'upi');

    if (search) {
      queryBuilder.andWhere(
        `(settlement.systemOrderId ILIKE :search OR settlement.transactionId ILIKE :search OR upi.upiId ILIKE :search OR identity.name ILIKE :search)`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (startDate && endDate) {
      const parsedStartDate = parseStartDate(startDate);
      const parsedEndDate = parseEndDate(endDate);

      queryBuilder.andWhere(
        'settlement.created_at BETWEEN :startDate AND :endDate',
        {
          startDate: parsedStartDate,
          endDate: parsedEndDate,
        },
      );
    }

    if (sortBy) {
      sortBy === 'latest'
        ? queryBuilder.orderBy('settlement.createdAt', 'DESC')
        : queryBuilder.orderBy('settlement.createdAt', 'ASC');
    }

    // Apply filterStatusArray filter
    if (filterStatusArray && filterStatusArray.length > 0) {
      queryBuilder.andWhere('settlement.status IN (:...filterStatusArray)', {
        filterStatusArray,
      });
    }

    const { rows, meta } = await paginateAndClamp(queryBuilder, {
      pageNumber,
      pageSize,
    });

    const dtos = plainToInstance(SettlementAdminResponseDto, rows);

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

  async getSettlementDetails(systemOrderId: string) {
    const settlement = await this.settlementRepository.findOne({
      where: { systemOrderId },
      relations: ['upiVendor', 'upiVendor.identity', 'upi'],
    });

    if (!settlement) throw new NotFoundException('Settlement order not found!');

    return plainToInstance(SettlementAdminResponseDto, settlement);
  }

  async paginatePendingSettlements(paginateRequestDto: PaginateRequestDto) {
    const {
      search,
      pageSize,
      pageNumber,
      startDate,
      endDate,
      sortBy,
    } = paginateRequestDto;

    const queryBuilder = this.settlementRepository
      .createQueryBuilder('settlement')
      .leftJoinAndSelect('settlement.upiVendor', 'upiVendor')
      .leftJoinAndSelect('upiVendor.identity', 'identity')
      .leftJoinAndSelect('settlement.upi', 'upi')
      .where('settlement.status = :status', { status: 'SUBMITTED' });

    if (search) {
      queryBuilder.andWhere(
        `(settlement.systemOrderId ILIKE :search OR settlement.transactionId ILIKE :search OR upi.upiId ILIKE :search OR identity.name ILIKE :search)`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (startDate && endDate) {
      const parsedStartDate = parseStartDate(startDate);
      const parsedEndDate = parseEndDate(endDate);

      queryBuilder.andWhere(
        'settlement.created_at BETWEEN :startDate AND :endDate',
        {
          startDate: parsedStartDate,
          endDate: parsedEndDate,
        },
      );
    }

    if (sortBy) {
      sortBy === 'latest'
        ? queryBuilder.orderBy('settlement.createdAt', 'DESC')
        : queryBuilder.orderBy('settlement.createdAt', 'ASC');
    }

    const { rows, meta } = await paginateAndClamp(queryBuilder, {
      pageNumber,
      pageSize,
    });

    const dtos = plainToInstance(SettlementAdminResponseDto, rows);

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
}

