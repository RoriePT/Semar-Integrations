import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubmitUtrDto {
  @IsString()
  @IsNotEmpty()
  payinOrderId: string;

  @IsOptional()
  @IsString()
  utr?: string;
}

