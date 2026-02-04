import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpiVendor } from './entities/upi-vendor.entity';
import { Upi } from 'src/channel/entity/upi.entity';

export interface UpiVendorQueue {
  upiId: string;
  title: string;
  mobile: string;
  beneficiaryName: string;
  email: string;
  isBusinessUpi: boolean;
  upiEntityId: number;
  vendorId: number;
  vendorName: string;
  vendorCommissionRate: number;
}

@Injectable()
export class UpiVendorQueueService {
  private readonly logger = new Logger(UpiVendorQueueService.name);
  private preservedUpiEntityId: number | null = null;
  private preservedUpiData: UpiVendorQueue | null = null;

  constructor(
    @InjectRepository(UpiVendor)
    private readonly upiVendorRepository: Repository<UpiVendor>,
    @InjectRepository(Upi)
    private readonly upiRepository: Repository<Upi>,
  ) {}

  private async fetchUpiById(
    upiEntityId: number,
  ): Promise<UpiVendorQueue | null> {
    const upi = await this.upiRepository
      .createQueryBuilder('upi')
      .innerJoinAndSelect('upi.identity', 'identity')
      .innerJoinAndSelect('identity.upiVendor', 'vendor')
      .where('upi.id = :upiEntityId', { upiEntityId })
      .andWhere('vendor.enabled = :vendorEnabled', { vendorEnabled: true })
      .andWhere('upi.enabled = :upiEnabled', { upiEnabled: true })
      .andWhere('upi.isUpiVendor = :isUpiVendor', { isUpiVendor: true })
      .getOne();

    if (!upi) return null;

    const vendor = upi.identity?.upiVendor;

    return {
      upiId: upi.upiId,
      title: upi.title,
      mobile: upi.mobile,
      beneficiaryName: upi.beneficiaryName,
      email: upi.email,
      isBusinessUpi: upi.isBusinessUpi,
      upiEntityId: upi.id,
      vendorId: vendor?.id,
      vendorName: vendor ? `${vendor.firstName} ${vendor.lastName}` : '',
      vendorCommissionRate: vendor?.commissionRate || 0,
    };
  }

  private async fetchNextAvailableUpi(): Promise<UpiVendorQueue | null> {
    const upiRows = await this.upiRepository
      .createQueryBuilder('upi')
      .innerJoinAndSelect('upi.identity', 'identity')
      .innerJoinAndSelect('identity.upiVendor', 'vendor')
      .where('vendor.enabled = :vendorEnabled', { vendorEnabled: true })
      .andWhere('upi.enabled = :upiEnabled', { upiEnabled: true })
      .andWhere('upi.isUpiVendor = :isUpiVendor', { isUpiVendor: true })
      .orderBy('vendor.createdAt', 'ASC')
      .addOrderBy('upi.id', 'ASC')
      .getMany();

    if (!upiRows.length) {
      return null;
    }

    if (this.preservedUpiEntityId !== null) {
      const currentIndex = upiRows.findIndex(
        (upi) => upi.id === this.preservedUpiEntityId,
      );

      if (currentIndex >= 0) {
        const nextIndex = (currentIndex + 1) % upiRows.length;
        const nextUpi = upiRows[nextIndex];
        const vendor = nextUpi.identity?.upiVendor;

        return {
          upiId: nextUpi.upiId,
          title: nextUpi.title,
          mobile: nextUpi.mobile,
          beneficiaryName: nextUpi.beneficiaryName,
          email: nextUpi.email,
          isBusinessUpi: nextUpi.isBusinessUpi,
          upiEntityId: nextUpi.id,
          vendorId: vendor?.id,
          vendorName: vendor ? `${vendor.firstName} ${vendor.lastName}` : '',
          vendorCommissionRate: vendor?.commissionRate || 0,
        };
      }
    }

    const firstUpi = upiRows[0];
    const vendor = firstUpi.identity?.upiVendor;

    return {
      upiId: firstUpi.upiId,
      title: firstUpi.title,
      mobile: firstUpi.mobile,
      beneficiaryName: firstUpi.beneficiaryName,
      email: firstUpi.email,
      isBusinessUpi: firstUpi.isBusinessUpi,
      upiEntityId: firstUpi.id,
      vendorId: vendor?.id,
      vendorName: vendor ? `${vendor.firstName} ${vendor.lastName}` : '',
      vendorCommissionRate: vendor?.commissionRate || 0,
    };
  }

  async getCurrentUpi(): Promise<UpiVendorQueue | null> {
    try {
      if (this.preservedUpiEntityId !== null && this.preservedUpiData) {
        const verified = await this.fetchUpiById(this.preservedUpiEntityId);
        if (verified) {
          this.preservedUpiData = verified;
          return verified;
        } else {
          this.preservedUpiEntityId = null;
          this.preservedUpiData = null;
        }
      }

      const newUpi = await this.fetchNextAvailableUpi();
      if (newUpi) {
        this.preservedUpiEntityId = newUpi.upiEntityId;
        this.preservedUpiData = newUpi;
      }

      return newUpi;
    } catch (error) {
      this.logger.error('Error fetching UPI from queue:', error);
      throw error;
    }
  }

  async incrementPointer(): Promise<void> {
    try {
      const nextUpi = await this.fetchNextAvailableUpi();
      if (nextUpi) {
        this.preservedUpiEntityId = nextUpi.upiEntityId;
        this.preservedUpiData = nextUpi;
      } else {
        this.preservedUpiEntityId = null;
        this.preservedUpiData = null;
      }
    } catch (error) {
      this.logger.error('Error incrementing pointer:', error);
    }
  }

  isPreservedUpi(upiEntityId: number): boolean {
    return this.preservedUpiEntityId === upiEntityId;
  }

  getPreservedUpiEntityId(): number | null {
    return this.preservedUpiEntityId;
  }

  async invalidatePreservedUpi(
    upiEntityId: number,
    incrementToNext: boolean = false,
  ): Promise<void> {
    if (this.preservedUpiEntityId === upiEntityId) {
      this.preservedUpiEntityId = null;
      this.preservedUpiData = null;

      if (incrementToNext) {
        await this.incrementPointer();
      }
    }
  }

  async getQueueStatus() {
    try {
      const allUpis = await this.upiRepository
        .createQueryBuilder('upi')
        .innerJoinAndSelect('upi.identity', 'identity')
        .innerJoinAndSelect('identity.upiVendor', 'vendor')
        .where('vendor.enabled = :vendorEnabled', { vendorEnabled: true })
        .andWhere('upi.enabled = :upiEnabled', { upiEnabled: true })
        .andWhere('upi.isUpiVendor = :isUpiVendor', { isUpiVendor: true })
        .orderBy('vendor.createdAt', 'ASC')
        .addOrderBy('upi.id', 'ASC')
        .getMany();

      return {
        totalUPIs: allUpis.length,
        preservedUpiEntityId: this.preservedUpiEntityId,
        preservedUpi: this.preservedUpiData,
      };
    } catch (error) {
      this.logger.error('Error getting queue status:', error);
      throw error;
    }
  }

  resetPointer(): void {
    this.preservedUpiEntityId = null;
    this.preservedUpiData = null;
  }
}
