import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { SettlementAdminService } from './settlement-admin.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enum/enum';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { UserInReq } from 'src/utils/decorators/user-in-req.decorator';
import { PaginateRequestDto } from 'src/utils/dtos/paginate.dto';

@Controller('settlement')
export class SettlementController {
  constructor(
    private readonly settlementService: SettlementService,
    private readonly settlementAdminService: SettlementAdminService,
  ) {}

  // Admin endpoints
  @Post('admin/paginate')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  adminSettlements(@Body() paginateRequestDto: PaginateRequestDto) {
    return this.settlementAdminService.paginateSettlements(paginateRequestDto);
  }

  @Post('admin/pending/paginate')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  adminPendingSettlements(@Body() paginateRequestDto: PaginateRequestDto) {
    return this.settlementAdminService.paginatePendingSettlements(
      paginateRequestDto,
    );
  }

  @Get('admin/:id')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  adminSettlementDetails(@Param('id') id: string) {
    return this.settlementAdminService.getSettlementDetails(id);
  }

  @Patch('admin/:id')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  adminUpdateStatus(
    @Param('id') id: string,
    @Body() updateSettlementDto: UpdateSettlementDto,
  ) {
    return this.settlementService.updateStatusAdmin(+id, updateSettlementDto);
  }

  @Patch('admin/:id/approve')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  approveSettlement(@Param('id') id: string) {
    return this.settlementService.approveSettlement(+id);
  }

  @Patch('admin/:id/reject')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  rejectSettlement(@Param('id') id: string) {
    return this.settlementService.rejectSettlement(+id);
  }

  // UPI Vendor endpoints
  @Get('upi-vendor/topup-channels')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  getTopupChannels(@UserInReq() user) {
    return this.settlementService.getTopupChannels(user.id);
  }

  @Post('upi-vendor')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  create(@Body() createSettlementDto: CreateSettlementDto, @UserInReq() user) {
    return this.settlementService.create(createSettlementDto, user.id);
  }

  @Post('upi-vendor/paginate')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  paginate(@UserInReq() user, @Body() paginateDto: PaginateRequestDto) {
    return this.settlementService.paginate(user.id, paginateDto);
  }

  @Get('upi-vendor/:id')
  @Roles(Role.UPI_VENDOR, Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string, @UserInReq() user) {
    const vendorId =
      user?.type?.toLowerCase() === 'upivendor' ? user.id : undefined;
    return this.settlementService.findOne(+id, vendorId);
  }

  @Patch('upi-vendor/:id')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateSettlementDto: UpdateSettlementDto,
    @UserInReq() user,
  ) {
    return this.settlementService.updateStatus(
      +id,
      updateSettlementDto,
      user.id,
    );
  }
}
