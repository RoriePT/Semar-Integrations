import {
  Controller,
  Get,
  HttpStatus,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { Payin } from 'src/payin/entities/payin.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('receipt')
export class ReceiptController {
  constructor(
    private readonly receiptService: ReceiptService,
    @InjectRepository(Payin)
    private readonly payinRepository: Repository<Payin>,
  ) {}

  @Get()
  async getReciept(@Res() res: Response) {
    // TODO: Currently Hard Code will be changed later
    const orderId = 'PAYIN-C0VSZSCPGMEJVKYKT';

    const pdfBuffer = await this.receiptService.createReceipt({
      orderId,
    });

    // return HttpStatus.SERVICE_UNAVAILABLE;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=receipt.pdf');
    res.send(pdfBuffer);
  }
}
