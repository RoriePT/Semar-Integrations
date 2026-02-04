import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsDateString,
  Matches,
  IsNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import {
  ChannelName,
  GatewayName,
  OrderStatus,
  SortedBy,
  UserTypeForTransactionUpdates,
} from '../enum/enum';

// Helper function to convert DD/MM/YYYY to a valid Date object
// Helper function to convert DD/MM/YYYY to a UTC Date object
export const parseStartDate = (dateString: string): string => {
  const parts = dateString.split('/');

  if (parts?.length === 3) {
    const [day, month, year] = parts;
    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);

    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  // If not in DD/MM/YYYY or invalid, return original string
  return dateString;
};

export const parseEndDate = (dateString: string): string => {
  const parts = dateString.split('/');

  if (parts?.length === 3) {
    const [day, month, year] = parts;
    const date = new Date(`${year}-${month}-${day}T23:59:59Z`);

    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  // If not in DD/MM/YYYY or invalid, return original string
  return dateString;
};
export class PaginateRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsBoolean()
  @IsOptional()
  all: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number = 1;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  userEmail?: string;

  @IsOptional()
  @IsEnum(SortedBy)
  sortBy?: SortedBy;

  @IsOptional()
  @IsBoolean()
  forBulletin?: boolean;

  @IsOptional()
  @IsBoolean()
  forPendingOrder?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  filterStatusArray?: OrderStatus[];

  @IsOptional()
  filterChannelArray?: ChannelName[];

  @IsOptional()
  @IsEnum(['BOTH', 'MEMBER', 'GATEWAY', 'ADMIN', 'UPI_VENDOR'])
  filterMadeVia?: 'BOTH' | 'MEMBER' | 'GATEWAY' | 'ADMIN' | 'UPI_VENDOR';

  @IsOptional()
  @IsNumber()
  filterAmountLower?: number;

  @IsOptional()
  @IsNumber()
  filterAmountUpper?: number;

  @IsOptional()
  @IsEnum(UserTypeForTransactionUpdates)
  balanceType?: UserTypeForTransactionUpdates;

  @IsOptional()
  @IsString()
  filterMemberSearch?: string;

  @IsOptional()
  filterGatewayArray?: GatewayName[];

  @IsOptional()
  filterMerchantSearch?: string;
}

export class ExportDto {
  @IsOptional()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'startDate must be in the format DD/MM/YYYY',
  })
  startDate?: string;

  @IsOptional()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'endDate must be in the format DD/MM/YYYY',
  })
  endDate?: string;
}
