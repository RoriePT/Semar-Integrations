import { Merchant } from 'src/merchant/entities/merchant.entity';
import { PayoutMerchantService } from './../payout/payout-merchant.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import {
  UpdateMerchantChannelDto,
  UpdateMerchantDto,
} from './dto/update-merchant.dto';
import { PaginateRequestDto } from 'src/utils/dtos/paginate.dto';
import { ChangePasswordDto } from 'src/identity/dto/changePassword.dto';
import { VerifyWithdrawalPasswordDto } from './dto/verify-withdrawal-password.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enum/enum';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { UserInReq } from 'src/utils/decorators/user-in-req.decorator';
import { AuthenticateRequestDto } from './dto/authenticate-request.dto';
import { Request } from 'express';

@Controller('merchant')
@UseGuards(RolesGuard)
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN, Role.MERCHANT)
  create(@Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantService.create(createMerchantDto);
  }

  @Post('auth')
  @Roles(Role.ALL)
  async authenticate(
    @Req() request: Request,
    @Body() authenticateRequestBody: AuthenticateRequestDto,
  ) {
    let clientIp = request.headers['x-forwarded-for'] as string;

    return this.merchantService.authenticate(authenticateRequestBody, clientIp);
  }

  @Get()
  @Roles(Role.MERCHANT)
  getProfile(@UserInReq() user) {
    return this.merchantService.getProfile(user.id);
  }

  @Get('balance')
  @Roles(Role.MERCHANT)
  getBalance(@UserInReq() user) {
    return this.merchantService.getBalance(+user.id);
  }

  @Get('payment-methods')
  @Roles(Role.MERCHANT)
  getChannelConfig(@UserInReq() user) {
    return this.merchantService.getChannelConfig(+user.id);
  }

  @Get('integration/:integrationId/basic')
  @Roles(Role.ALL)
  getBasicDetailsByIntegrationId(
    @Param('integrationId') integrationId: string,
  ) {
    return this.merchantService.getBasicDetailsByIntegrationId(integrationId);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  findOne(@Param('id') id: string) {
    return this.merchantService.findOne(+id);
  }

  @Patch('channels')
  @UseGuards(RolesGuard)
  @Roles(Role.MERCHANT)
  updateAgentChannels(
    @UserInReq() user,
    @Body() updateMerchantChannelDto: UpdateMerchantChannelDto,
  ) {
    return this.merchantService.updateChannels(
      +user.id,
      updateMerchantChannelDto,
    );
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateMerchantDto: UpdateMerchantDto,
  ) {
    return this.merchantService.update(+id, updateMerchantDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  remove(@Param('id') id: string) {
    return this.merchantService.remove(+id);
  }

  @Post('paginate')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  paginate(@Body() paginateRequestDto: PaginateRequestDto) {
    return this.merchantService.paginate(paginateRequestDto);
  }

  @Post('change-password')
  @Roles(Role.MERCHANT)
  changePassword(
    @UserInReq() user,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.merchantService.changePassword(changePasswordDto, user.id);
  }

  @Post('change-withdrawal-password')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN, Role.MERCHANT)
  changeWithdrawalPassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @UserInReq() user,
  ) {
    return this.merchantService.changeWithdrawalPassword(
      changePasswordDto,
      user.id,
    );
  }

  @Post('verify-withdrawal-password')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN, Role.MERCHANT)
  verifyWithdrawalPassword(
    @UserInReq() user,
    @Body() verifyWithdrawalPasswordDto: VerifyWithdrawalPasswordDto,
  ) {
    return this.merchantService.verifyWithdrawalPassword(
      verifyWithdrawalPasswordDto,
      user.id,
    );
  }
}
