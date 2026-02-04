import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { PaymentSystemService } from './payment-system.service';
import { Role } from 'src/utils/enum/enum';
import { GetPaymentPageApiModeDto } from './dto/getPayPage.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { UserInReq } from 'src/utils/decorators/user-in-req.decorator';
import { CashfreeService } from './cashfree/cashfree.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly service: PaymentSystemService,
    private readonly cashfreeService: CashfreeService,
  ) {}

  @Post('get-payment-page')
  @Roles(Role.MERCHANT)
  @UseGuards(RolesGuard)
  async getPayemntPageForApiMode(
    @Req() request: Request,
    @UserInReq() user,
    @Body() getPaymentpageDto: GetPaymentPageApiModeDto,
  ) {
    let clientIp = request.headers['x-forwarded-for'] as string;
    return this.service.getPaymentPageForApiMode(
      +user.id,
      getPaymentpageDto,
      clientIp,
    );
  }

  @Get('order-status/:orderId')
  @Roles(Role.MERCHANT)
  @UseGuards(RolesGuard)
  async getOrderStatusForApiMode(
    @UserInReq() user,
    @Param('orderId') orderId: string,
    @Query('environment') environment: 'sandbox' | 'live',
  ) {
    return this.service.getOrderStatusForApiMode(
      orderId,
      environment,
      +user.id,
    );
  }
}
