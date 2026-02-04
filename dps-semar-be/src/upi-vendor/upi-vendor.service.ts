import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import QRCode from 'qrcode';

import { CreateUpiVendorDto } from './dto/create-upi-vendor.dto';
import { UpdateUpiVendorDto } from './dto/update-upi-vendor.dto';
import { UpiVendorResponseDto } from './dto/upi-vendor-response.dto';
import { UpiVendorPaginateResponseDto } from './dto/upi-vendor-paginate-response.dto';
import { UpiResponseDto } from './dto/upi-response.dto';

import { UpiVendor } from './entities/upi-vendor.entity';

import { IdentityService } from 'src/identity/identity.service';
import { Upi } from 'src/channel/entity/upi.entity';
import { Payin } from 'src/payin/entities/payin.entity';
import { Settlement } from 'src/settlement/entities/settlement.entity';
import { OrderStatus, PaymentMadeOn } from 'src/utils/enum/enum';
import {
  PaginateRequestDto,
  parseEndDate,
  parseStartDate,
} from 'src/utils/dtos/paginate.dto';
import { PayinUpiVendorResponseDto } from 'src/payin/dto/payin-upi-vendor-response.dto';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { UpiVendorQueueService } from './upi-vendor-queue.service';
import { paginateAndClamp } from 'src/utils/pagination.util';

@Injectable()
export class UpiVendorService {
  constructor(
    @InjectRepository(UpiVendor)
    private readonly upiVendorRepository: Repository<UpiVendor>,
    @InjectRepository(Upi)
    private readonly upiRepository: Repository<Upi>,
    @InjectRepository(Payin)
    private readonly payinRepository: Repository<Payin>,
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,

    private readonly identityService: IdentityService,
    private readonly systemConfigService: SystemConfigService,
    private readonly upiVendorQueueService: UpiVendorQueueService,
  ) {}

  async create(createUpiVendorDto: CreateUpiVendorDto) {
    const {
      email,
      password,
      enabled,
      firstName,
      lastName,
      phone,
      upiIds,
      commissionRate,
      settlementUpiId,
    } = createUpiVendorDto;

    const identity = await this.identityService.create(
      email,
      password,
      'UPI_VENDOR',
    );

    const upiVendor = this.upiVendorRepository.create({
      identity,
      firstName,
      lastName,
      phone,
      enabled,
      commissionRate: commissionRate ?? 0,
      settlementUpiId: settlementUpiId || null,
    });

    await this.upiVendorRepository.save(upiVendor);

    if (upiIds) {
      for (const element of upiIds) {
        await this.upiRepository.save({
          upiId: element?.upiId,
          title: element?.title,
          enabled: element?.enabled ?? true,
          isBusinessUpi: element?.isBusinessUpi ?? true,
          tr: element?.tr && element.tr.trim() !== '' ? element.tr : null,
          isUpiVendor: true,
          mobile: phone || '',
          identity,
        });
      }
    }

    return HttpStatus.OK;
  }

  async findAll(): Promise<UpiVendorResponseDto[]> {
    const results = await this.upiVendorRepository.find({
      relations: ['identity', 'identity.upi'],
    });

    return plainToInstance(UpiVendorResponseDto, results);
  }

  async findOne(id: number): Promise<UpiVendorResponseDto> {
    const results = await this.upiVendorRepository.findOne({
      where: { id },
      relations: ['identity', 'identity.upi'],
    });

    if (!results) throw new NotFoundException('UPI Vendor not found.');

    const payins = await this.payinRepository.find({
      where: { upiVendor: { id } },
    });

    const upiIdsWithPayins = new Set<string>();
    for (const payin of payins) {
      if (payin && payin.transactionDetails) {
        try {
          const transactionDetails =
            typeof payin.transactionDetails === 'string'
              ? JSON.parse(payin.transactionDetails)
              : payin.transactionDetails;

          const upiIdFromDetails = transactionDetails?.upiId;
          if (upiIdFromDetails) {
            upiIdsWithPayins.add(upiIdFromDetails);
          }
        } catch (error) {
          // Skip invalid transaction details
        }
      }
    }
    const transformedResults = {
      ...results,
      identity: {
        ...results.identity,
        upi:
          results.identity?.upi?.map((upi) => ({
          ...upi,
          hasReceivedPayin: upiIdsWithPayins.has(upi.upiId),
          isPreserved: this.upiVendorQueueService.isPreservedUpi(upi.id),
        })) || [],
      },
    };

    return plainToInstance(UpiVendorResponseDto, transformedResults);
  }

  async update(id: number, updateDto: UpdateUpiVendorDto): Promise<HttpStatus> {
    const upiVendorData = await this.upiVendorRepository.findOneBy({ id });

    if (!upiVendorData) throw new NotFoundException('UPI Vendor not found.');

    const email = updateDto.email;
    const password = updateDto.password;
    const updateLoginCredentials = updateDto.updateLoginCredentials;
    const upiIds = updateDto.upiIds;
    const phone = updateDto.phone;

    delete updateDto.updateLoginCredentials;
    delete updateDto.email;
    delete updateDto.password;
    delete updateDto.upiIds;

    await this.upiVendorRepository.update({ id: id }, updateDto);

    const upiVendor = await this.upiVendorRepository.findOne({
      where: { id: id },
      relations: ['identity', 'identity.upi'],
    });

    const existingUpiIds =
      upiVendor.identity?.upi?.filter((upi) => upi.isUpiVendor === true) || [];

    const payins = await this.payinRepository.find({
      where: { upiVendor: { id } },
    });

    const upiIdsWithPayins = new Set<string>();
    for (const payin of payins) {
      if (payin && payin.transactionDetails) {
        try {
          const transactionDetails =
            typeof payin.transactionDetails === 'string'
              ? JSON.parse(payin.transactionDetails)
              : payin.transactionDetails;

          const upiIdFromDetails = transactionDetails?.upiId;
          if (upiIdFromDetails) {
            upiIdsWithPayins.add(upiIdFromDetails);
          }
        } catch (error) {
          // Skip invalid transaction details
        }
      }
    }

    const protectedUpiIds = new Set<number>();
    for (const existingUpi of existingUpiIds) {
      if (upiIdsWithPayins.has(existingUpi.upiId)) {
        protectedUpiIds.add(existingUpi.id);
      }
      if (this.upiVendorQueueService.isPreservedUpi(existingUpi.id)) {
        protectedUpiIds.add(existingUpi.id);
      }
    }
    if (upiIds && upiIds.length > 0) {
      const newUpiIdValues = new Set(upiIds.map((element) => element?.upiId));

      for (const element of upiIds) {
        const existingUpi = existingUpiIds.find(
          (upi) => upi.upiId === element?.upiId,
        );

        if (existingUpi) {
          const isPreserved = this.upiVendorQueueService.isPreservedUpi(
            existingUpi.id,
          );

          if (isPreserved) {
            if (element?.title && element.title !== existingUpi.title) {
              throw new BadRequestException(
                `Cannot update title of UPI ID "${existingUpi.upiId}" as it is currently preserved and in use for payment assignments. Only enable/disable is allowed.`,
              );
            }

            if (
              element?.isBusinessUpi !== undefined &&
              element.isBusinessUpi !== existingUpi.isBusinessUpi
            ) {
              throw new BadRequestException(
                `Cannot update business UPI flag of UPI ID "${existingUpi.upiId}" as it is currently preserved and in use for payment assignments. Only enable/disable is allowed.`,
              );
            }

            const wasEnabled = existingUpi.enabled;
            // Use the provided enabled value if it exists, otherwise keep existing value
            const newEnabled =
              element?.enabled !== undefined
                ? element.enabled
                : existingUpi.enabled;

            const updateData: any = {
                enabled: newEnabled,
                title: existingUpi.title,
                isBusinessUpi: existingUpi.isBusinessUpi,
                mobile: existingUpi.mobile,
            };
            // Only update tr if it's provided and not empty
            if (element?.tr !== undefined && element.tr !== null && element.tr.trim() !== '') {
              updateData.tr = element.tr;
            }
            await this.upiRepository.update({ id: existingUpi.id }, updateData);

            if (wasEnabled && !newEnabled) {
              await this.upiVendorQueueService.invalidatePreservedUpi(
                existingUpi.id,
                true,
              );
            }

            continue;
          }

          if (protectedUpiIds.has(existingUpi.id)) {
            // For protected UPI IDs (hasReceivedPayin), only allow updating enabled field
            // Validate that other fields are not being changed
            if (element?.title && element.title !== existingUpi.title) {
              throw new BadRequestException(
                `Cannot update title of UPI ID "${existingUpi.upiId}" as it has received payins. Only enable/disable is allowed.`,
              );
            }

            if (
              element?.isBusinessUpi !== undefined &&
              element.isBusinessUpi !== existingUpi.isBusinessUpi
            ) {
              throw new BadRequestException(
                `Cannot update business UPI flag of UPI ID "${existingUpi.upiId}" as it has received payins. Only enable/disable is allowed.`,
              );
            }

            // Always allow updating enabled field
            const wasEnabled = existingUpi.enabled;
            const newEnabled =
              element?.enabled !== undefined
                ? element.enabled
                : existingUpi.enabled;

            const updateData: any = {
              enabled: newEnabled,
              title: existingUpi.title,
              isBusinessUpi: existingUpi.isBusinessUpi,
              mobile: existingUpi.mobile,
            };
            // Only update tr if it's provided and not empty
            if (element?.tr !== undefined && element.tr !== null && element.tr.trim() !== '') {
              updateData.tr = element.tr;
            }
            await this.upiRepository.update({ id: existingUpi.id }, updateData);

            if (wasEnabled && !newEnabled) {
              await this.upiVendorQueueService.invalidatePreservedUpi(
                existingUpi.id,
                true,
              );
            }

            continue;
          }

          // For non-protected UPI IDs, all fields are editable
          const wasEnabled = existingUpi.enabled;
          // Use the provided enabled value if it exists, otherwise keep existing value
          const newEnabled =
            element?.enabled !== undefined
              ? element.enabled
              : existingUpi.enabled;

          const updateData: any = {
              title: element?.title,
            enabled: newEnabled,
              isBusinessUpi: element?.isBusinessUpi ?? true,
              mobile: phone || upiVendor.phone || '',
          };
          // Only update tr if it's provided and not empty
          if (element?.tr !== undefined && element.tr !== null && element.tr.trim() !== '') {
            updateData.tr = element.tr;
          }
          await this.upiRepository.update({ id: existingUpi.id }, updateData);

          if (wasEnabled && !newEnabled) {
            await this.upiVendorQueueService.invalidatePreservedUpi(
              existingUpi.id,
              true,
            );
          }
        } else {
          await this.upiRepository.save({
          upiId: element?.upiId,
          title: element?.title,
          enabled: element?.enabled ?? true,
          isBusinessUpi: element?.isBusinessUpi ?? true,
          isUpiVendor: true,
          mobile: phone || upiVendor.phone || '',
            tr: element?.tr && element.tr.trim() !== '' ? element.tr : null,
          identity: upiVendor.identity,
        });
        }
      }

      for (const existingUpi of existingUpiIds) {
        if (!newUpiIdValues.has(existingUpi.upiId)) {
          if (this.upiVendorQueueService.isPreservedUpi(existingUpi.id)) {
            throw new BadRequestException(
              `Cannot delete UPI ID "${existingUpi.upiId}" as it is currently preserved and in use for payment assignments. Please wait until it's no longer preserved.`,
            );
          }

          if (!protectedUpiIds.has(existingUpi.id)) {
            await this.upiRepository.delete({ id: existingUpi.id });
            await this.upiVendorQueueService.invalidatePreservedUpi(
              existingUpi.id,
              false,
            );
          }
        }
      }
    } else {
      for (const existingUpi of existingUpiIds) {
        if (this.upiVendorQueueService.isPreservedUpi(existingUpi.id)) {
          throw new BadRequestException(
            `Cannot delete UPI ID "${existingUpi.upiId}" as it is currently preserved and in use for payment assignments. Please wait until it's no longer preserved.`,
          );
        }

        if (!protectedUpiIds.has(existingUpi.id)) {
          await this.upiRepository.delete({ id: existingUpi.id });
          await this.upiVendorQueueService.invalidatePreservedUpi(
            existingUpi.id,
            false,
          );
        }
      }
    }

    if (updateLoginCredentials) {
      await this.identityService.updateLogin(
        upiVendor.identity.id,
        email,
        password,
      );
    }

    return HttpStatus.OK;
  }

  async remove(id: number) {
    const upiVendor = await this.upiVendorRepository.findOne({
      where: { id: id },
      relations: ['identity'],
    });

    if (!upiVendor) throw new NotFoundException();

    const vendorWithUpi = await this.upiVendorRepository.findOne({
      where: { id },
      relations: ['identity', 'identity.upi'],
    });

    await this.upiVendorRepository.delete(id);
    await this.identityService.remove(upiVendor.identity?.id);

    if (vendorWithUpi?.identity?.upi) {
      for (const upi of vendorWithUpi.identity.upi) {
        if (upi.isUpiVendor) {
          await this.upiVendorQueueService.invalidatePreservedUpi(
            upi.id,
            false,
          );
        }
      }
    }

    return HttpStatus.OK;
  }

  async paginate(paginateDto: PaginateRequestDto) {
    const query = this.upiVendorRepository.createQueryBuilder('upiVendor');

    query.leftJoinAndSelect('upiVendor.identity', 'identity');
    query.leftJoinAndSelect('identity.upi', 'upi');

    const search = paginateDto.search;
    const pageSize = paginateDto.pageSize;
    const pageNumber = paginateDto.pageNumber;
    const sortBy = paginateDto.sortBy;

    if (search) {
      query.andWhere(
        `CONCAT(upiVendor.first_name, ' ', upiVendor.last_name) ILIKE :search`,
        { search: `%${search}%` },
      );
    }

    if (paginateDto.startDate && paginateDto.endDate) {
      const startDate = parseStartDate(paginateDto.startDate);
      const endDate = parseEndDate(paginateDto.endDate);

      query.andWhere('upiVendor.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (sortBy)
      sortBy === 'latest'
        ? query.orderBy('upiVendor.createdAt', 'DESC')
        : query.orderBy('upiVendor.createdAt', 'ASC');

    const { rows, meta } = await paginateAndClamp(query, {
      pageNumber,
      pageSize,
    });

    const dtos = plainToInstance(UpiVendorPaginateResponseDto, rows);

    // Return paginated result
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

  async exportRecords(startDate: string, endDate: string) {
    startDate = parseStartDate(startDate);
    endDate = parseEndDate(endDate);

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const [rows, total] = await this.upiVendorRepository.findAndCount({
      relations: ['identity'],
      where: {
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const dtos = plainToInstance(UpiVendorResponseDto, rows);

    return {
      data: dtos,
      total,
    };
  }

  async paginateUpiIds(id: number, paginateDto: PaginateRequestDto) {
    // First get the vendor with identity
    const vendor = await this.upiVendorRepository.findOne({
      where: { id },
      relations: ['identity'],
    });

    if (!vendor) throw new NotFoundException('UPI Vendor not found.');

    const query = this.upiRepository.createQueryBuilder('upi');

    // Filter by vendor's identity
    query.where('upi.identity = :identityId', {
      identityId: vendor.identity.id,
    });

    const search = paginateDto.search;
    const pageSize = paginateDto.pageSize;
    const pageNumber = paginateDto.pageNumber;
    const sortBy = paginateDto.sortBy;

    // Handle search by upiId or title
    if (search) {
      query.andWhere(
        `(CONCAT(upi.upiId) ILIKE :search OR CONCAT(upi.title) ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    if (sortBy)
      sortBy === 'latest'
        ? query.orderBy('upi.id', 'DESC')
        : query.orderBy('upi.id', 'ASC');

    const { rows, meta } = await paginateAndClamp(query, {
      pageNumber,
      pageSize,
    });

    const dtos = plainToInstance(UpiResponseDto, rows);

    // Return paginated result
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

  async getPendingOrders(vendorId: number, paginateDto: PaginateRequestDto) {
    // First get the vendor with their UPI IDs
    const vendor = await this.upiVendorRepository.findOne({
      where: { id: vendorId },
      relations: ['identity', 'identity.upi'],
    });

    if (!vendor) throw new NotFoundException('UPI Vendor not found.');

    // Get all UPI IDs belonging to this vendor
    const upiIds = vendor.identity.upi
      .filter((upi) => upi.isUpiVendor && upi.enabled)
      .map((upi) => upi.id);

    if (!upiIds.length) {
      return {
        data: [],
        total: 0,
        page: paginateDto.pageNumber,
        pageSize: paginateDto.pageSize,
        totalPages: 0,
        startRecord: 0,
        endRecord: 0,
      };
    }

    const query = this.payinRepository.createQueryBuilder('payin');

    // Add relations
    query.leftJoinAndSelect('payin.user', 'user');
    query.leftJoinAndSelect('payin.merchant', 'merchant');
    query.leftJoinAndSelect('payin.upiVendor', 'upiVendor');

    // Filter by UPI vendor gateway and submitted status
    query.where('payin.payinMadeOn = :paymentMode', {
      paymentMode: PaymentMadeOn.UPI_VENDOR,
    });
    query.andWhere('payin.status = :status', {
      status: OrderStatus.SUBMITTED,
    });
    query.andWhere('payin.upiVendor = :vendorId', { vendorId });

    const search = paginateDto.search;
    const pageSize = paginateDto.pageSize;
    const pageNumber = paginateDto.pageNumber;
    const sortBy = paginateDto.sortBy;

    // Handle search by systemOrderId or trackingId
    if (search) {
      query.andWhere(
        `(payin.systemOrderId ILIKE :search OR payin.trackingId ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    // Handle filtering by created_at between startDate and endDate
    if (paginateDto.startDate && paginateDto.endDate) {
      const startDate = parseStartDate(paginateDto.startDate);
      const endDate = parseEndDate(paginateDto.endDate);

      query.andWhere('payin.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (sortBy)
      sortBy === 'latest'
        ? query.orderBy('payin.createdAt', 'DESC')
        : query.orderBy('payin.createdAt', 'ASC');

    const { rows, meta } = await paginateAndClamp(query, {
      pageNumber,
      pageSize,
    });

    const dtos = plainToInstance(PayinUpiVendorResponseDto, rows);

    // Return paginated result
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

  async getDetailsForSettlement(vendorId: number) {
    // Get vendor with UPI IDs
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
    const pendingAmountByUpiId = pendingSettlements.reduce(
      (acc, settlement) => {
      const upiId = settlement.upi.id;
      if (!acc[upiId]) {
        acc[upiId] = 0;
      }
      acc[upiId] += settlement.paidAmount || 0;
      return acc;
      },
      {} as Record<number, number>,
    );

    // Get all UPI IDs with settlement amounts (subtracting pending amounts)
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
          id: upi.id,
          upiId: upi.upiId,
          title: upi.title,
          settlementAmount: availableSettlementAmount,
          pendingSettlementAmount: pendingAmount,
          beneficiaryName: upi.beneficiaryName,
          mobile: upi.mobile,
          email: upi.email,
          isBusinessUpi: upi.isBusinessUpi,
          enabled: upi.enabled,
        };
      });

    // Calculate total pending settlement amount
    const totalPendingSettlement = Object.values(pendingAmountByUpiId).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    // Generate QR code for settlement UPI ID if available
    let settlementRecipientDetails = null;
    if (vendor.settlementUpiId) {
      const upiIntentURI = `upi://pay?pa=${vendor.settlementUpiId}&cu=INR`;
      const qrCode = await QRCode.toDataURL(upiIntentURI);
      settlementRecipientDetails = {
        upiId: vendor.settlementUpiId,
        qrCode: qrCode,
      };
    }

    return {
      upiIds: upiIds,
      settlementRecipientDetails: settlementRecipientDetails,
      totalSettlement: upiIds.reduce(
        (sum, upi) => sum + upi.settlementAmount,
        0,
      ),
      totalPendingSettlement: totalPendingSettlement,
    };
  }

  async getPreservedUpiDetails() {
    const currentUpi = await this.upiVendorQueueService.getCurrentUpi();

    if (!currentUpi) {
      return {
        isPreserved: false,
        preservedUpi: null,
        message: 'No UPI ID is currently preserved',
      };
    }

    const upi = await this.upiRepository.findOne({
      where: { id: currentUpi.upiEntityId },
      relations: ['identity', 'identity.upiVendor'],
    });

    if (!upi) {
      return {
        isPreserved: false,
        preservedUpi: null,
        message: 'Preserved UPI ID not found in database',
      };
    }

    const vendor = upi.identity?.upiVendor;

    return {
      isPreserved: true,
      preservedUpi: {
        upiEntityId: upi.id,
        upiId: upi.upiId,
        title: upi.title,
        mobile: upi.mobile,
        beneficiaryName: upi.beneficiaryName,
        email: upi.email,
        isBusinessUpi: upi.isBusinessUpi,
        enabled: upi.enabled,
        vendor: {
          id: vendor?.id,
          name: vendor ? `${vendor.firstName} ${vendor.lastName}` : null,
          phone: vendor?.phone || null,
          commissionRate: vendor?.commissionRate || 0,
        },
      },
    };
  }
}
