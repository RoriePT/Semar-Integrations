import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginateRequestDto } from 'src/utils/dtos/paginate.dto';
import { PayinAdminService } from './payin-admin.service';
import { PayinMerchantService } from './payin-merchant.service';
import { PayinMemberService } from './payin-member.service';
import { PayinUpiVendorService } from './payin-upi-vendor.service';
import { PayinService } from './payin.service';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { OrderStatus, Role } from 'src/utils/enum/enum';
import { UserInReq } from 'src/utils/decorators/user-in-req.decorator';
import { Submerchant } from 'src/sub-merchant/entities/sub-merchant.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentOrderDtoAdmin } from 'src/payment-system/dto/createPaymentOrder.dto';

@Controller('payin')
export class PayinController {
  constructor(
    @InjectRepository(Submerchant)
    private readonly submerchantRepository: Repository<Submerchant>,
    private payinAdminService: PayinAdminService,
    private payinMemberService: PayinMemberService,
    private payinMerchantService: PayinMerchantService,
    private payinUpiVendorService: PayinUpiVendorService,
    private payinService: PayinService,
  ) {}

  @Post()
  create(@Body() createPayinDto) {
    return this.payinService.create(createPayinDto);
  }

  @Post('create-by-admin')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  createAndAssign(@Body() createPayinDto: CreatePaymentOrderDtoAdmin) {
    return this.payinService.createAndAssign(createPayinDto);
  }

  @Post('admin/paginate')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  adminPayins(@Body() paginateRequestDto: PaginateRequestDto) {
    return this.payinAdminService.paginatePayins(paginateRequestDto);
  }

  @Post('admin/paginate/mismatched-utr')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  adminMismatchedUtrPayins(@Body() paginateRequestDto: PaginateRequestDto) {
    return this.payinAdminService.paginateMismatchedUtrPayins(
      paginateRequestDto,
    );
  }

  @Post('merchant/paginate')
  @Roles(Role.MERCHANT, Role.SUB_MERCHANT)
  @UseGuards(RolesGuard)
  async merchantPayins(
    @UserInReq() user,
    @Body() paginateRequestDto: PaginateRequestDto,
  ) {
    const isSubMerchant = user?.type?.includes('SUB');

    let subMerchant = null;

    if (isSubMerchant)
      subMerchant = await this.submerchantRepository.findOne({
        where: { id: user.id },
        relations: ['merchant'],
      });

    const merchantId = subMerchant ? subMerchant.merchant.id : user.id;

    return this.payinMerchantService.paginatePayins(
      +merchantId,
      paginateRequestDto,
    );
  }

  @Post('member/paginate')
  @Roles(Role.MEMBER)
  @UseGuards(RolesGuard)
  memberPayins(
    @UserInReq() user,
    @Body() paginateRequestDto: PaginateRequestDto,
  ) {
    return this.payinMemberService.paginatePayins(user.id, paginateRequestDto);
  }

  @Post('upi-vendor/paginate')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  upiVendorPayins(
    @UserInReq() user,
    @Body() paginateRequestDto: PaginateRequestDto,
  ) {
    return this.payinUpiVendorService.paginatePayins(
      user.id,
      paginateRequestDto,
    );
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  getAllPayins() {
    return this.payinService.findAll();
  }

  @Get('/:merchantOrderId')
  @Roles(Role.ALL)
  @UseGuards(RolesGuard)
  getPayinDetailsFromMerchantOrderId(
    @Param('merchantOrderId') merchantOrderId: string,
    @Query('integrationId') integrationId: string,
  ) {
    return this.payinService.getPayinDetailsFromMerchantOrderId(
      merchantOrderId,
      integrationId,
    );
  }

  @Get('admin/:id')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  getPayinOrderDetailsAdmin(@Param('id') id: string) {
    return this.payinAdminService.getPayinDetails(id);
  }

  @Get('merchant/:id')
  @Roles(Role.MERCHANT)
  @UseGuards(RolesGuard)
  getPayinOrderDetailsMerchant(@Param('id') id: string) {
    return this.payinMerchantService.getPayinDetails(id);
  }

  @Get('member/:id')
  @Roles(Role.MEMBER)
  @UseGuards(RolesGuard)
  getPayinOrderDetailsMember(@Param('id') id: string) {
    return this.payinMemberService.getPayinDetails(id);
  }

  @Get('upi-vendor/:id')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  getPayinOrderDetailsUpiVendor(@Param('id') id: string) {
    return this.payinUpiVendorService.getPayinDetails(id);
  }

  @Post('update-status-assigned')
  updatePayinStatusToAssigned(@Body() body) {
    return this.payinService.updatePayinStatusToAssigned(body);
  }

  @Post('update-status-complete')
  updatePayinStatusToCompleted(@Body() body) {
    return this.payinService.updatePayinStatusToComplete(body);
  }

  @Post('update-status-failed')
  updatePayinStatusToFailed(@Body() body) {
    return this.payinService.updatePayinStatusToFailed(body);
  }

  @Post('update-status-submitted')
  updatePayinStatusToSubmitted(@Body() body) {
    return this.payinService.updatePayinStatusToSubmitted(body);
  }

  @Patch('update-status-manual/:systemOrderId')
  updatePayinStatusManual(
    @Param('systemOrderId') systemOrderId: string,
    @Query('status') status: OrderStatus.COMPLETE | OrderStatus.FAILED,
  ) {
    return this.payinService.updatePayinStatusManual(systemOrderId, status);
  }

  @Put('success-callback/:id')
  handleCallbackStatusSuccess(
    @Param('id') id: string,
    @Query('environment') environment,
  ) {
    return this.payinService.handleCallbackStatusSuccess(id, environment);
  }

  @Get('merchant-list')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  getMerchantList() {
    return this.payinAdminService.getMerchantList();
  }

  @Post('member-list')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  getMemberList(@Body() body) {
    return this.payinAdminService.getMemberList(body);
  }

  @Get('enduser-suggestions/:id')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN, Role.MERCHANT, Role.SUB_MERCHANT)
  @UseGuards(RolesGuard)
  getEndUserIdSuggestions(@Param('id') id: number) {
    return this.payinAdminService.getEndUserIdSuggestions(id);
  }
}
