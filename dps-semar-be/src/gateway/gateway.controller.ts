import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UpdateRazorpayDto } from './dto/create-razorpay.dto';
import { GatewayService } from './gateway.service';
import { UpdatePhonepDto } from './dto/create-phonepe.dto';
import { UpdateChannelSettingsDto } from './dto/create-channel-settings.dto';
import { GetChannelSettingsDto } from './dto/get-channel-settings.dto';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enum/enum';
import { UpdateUniqpayDto } from './dto/create-uniqpay.dto';
import { UpdatePayuDto } from './dto/create-payu.dto';
import { UpdateCashfreeDto } from './dto/create-cashfree.dto';
import { UpdateDokuDto } from './dto/create-doku.dto';
import { UpdateMidtransDto } from './dto/create-midtrans.dto';
import { UpdateXenditDto } from './dto/create-xendit.dto';

@Controller('gateway')
@UseGuards(RolesGuard)
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  @Post('razorpay/create')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  CreateRazorpay() {
    return this.gatewayService.createRazorPay();
  }

  @Get('razorpay')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  getRazorpayConfig() {
    return this.gatewayService.getRazorpay();
  }

  @Post('razorpay/update')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  UpdateRazorpay(@Body() updateRazorpayDto: UpdateRazorpayDto) {
    return this.gatewayService.updateRazorpay(updateRazorpayDto);
  }

  @Post('phonepe/create')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  createPhonepe() {
    return this.gatewayService.createPhonepe();
  }

  @Get('phonepe')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  getPhonepeConfig() {
    return this.gatewayService.getPhonepe();
  }

  @Post('phonepe/update')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  updatePhonepe(@Body() updatePhonepeDto: UpdatePhonepDto) {
    return this.gatewayService.updatePhonepe(updatePhonepeDto);
  }

  @Post('uniqpay/create')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  CreateUniqpay() {
    return this.gatewayService.createUniqpay();
  }

  @Get('uniqpay')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  getUniqpayConfig() {
    return this.gatewayService.getUniqpay();
  }

  @Post('uniqpay/update')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  UpdateUniqpay(@Body() updateUniqpayDto: UpdateUniqpayDto) {
    return this.gatewayService.updateUniqpay(updateUniqpayDto);
  }

  @Post('payu/create')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  CreatePayu() {
    return this.gatewayService.createPayu();
  }

  @Get('payu')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  getPayuConfig() {
    return this.gatewayService.getPayu();
  }

  @Post('payu/update')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  UpdatePayu(@Body() updatePayuDto: UpdatePayuDto) {
    return this.gatewayService.updatePayu(updatePayuDto);
  }

  @Post('cashfree/create')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  CreateCashfree() {
    return this.gatewayService.createCashfree();
  }

  @Get('cashfree')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  getCashfreeConfig() {
    return this.gatewayService.getCashfree();
  }

  @Post('cashfree/update')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  UpdateCashfree(@Body() updateCashfreeDto: UpdateCashfreeDto) {
    return this.gatewayService.updateCashfree(updateCashfreeDto);
  }

  @Post('doku/create')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  CreateDoku() {
    return this.gatewayService.createDoku();
  }

  @Get('doku')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  getDokuConfig() {
    return this.gatewayService.getDoku();
  }

  @Post('doku/update')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  UpdateDoku(@Body() updateDokuDto: UpdateDokuDto) {
    return this.gatewayService.updateDoku(updateDokuDto);
  }

  @Post('midtrans/create')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  CreateMidtrans() {
    return this.gatewayService.createMidtrans();
  }

  @Get('midtrans')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  getMidtransConfig() {
    return this.gatewayService.getMidtrans();
  }

  @Post('midtrans/update')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  UpdateMidtrans(@Body() updateMidtransDto: UpdateMidtransDto) {
    return this.gatewayService.updateMidtrans(updateMidtransDto);
  }

  @Post('xendit/create')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  CreateXendit() {
    return this.gatewayService.createXendit();
  }

  @Get('xendit')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  getXenditConfig() {
    return this.gatewayService.getXendit();
  }

  @Post('xendit/update')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  UpdateXendit(@Body() updateXenditDto: UpdateXenditDto) {
    return this.gatewayService.updateXendit(updateXenditDto);
  }

  @Get('channel-settings/all')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  getAllChannelSettings() {
    return this.gatewayService.getAllChannelsSetting();
  }

  @Post('channel-settings')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  getChannelSettings(@Body() getChannelsettingsDto: GetChannelSettingsDto) {
    return this.gatewayService.getChannelSettings(getChannelsettingsDto);
  }

  @Post('channel-setting/create')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  createChannelSettings() {
    return this.gatewayService.createChannelSettings();
  }

  @Patch('channel-setting/update')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  updateChannelSettings(
    @Body() updateChannelSettingsDto: UpdateChannelSettingsDto,
  ) {
    return this.gatewayService.updateChannelSettings(updateChannelSettingsDto);
  }
}
