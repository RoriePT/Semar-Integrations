import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from 'src/utils/enum/enum';

export class UpdateSettlementDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;
}

