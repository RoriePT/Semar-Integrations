import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BulletinService } from './bulletin.service';
import { PaginateRequestDto } from './dto/paginate.dto';
import { UserInReq } from 'src/utils/decorators/user-in-req.decorator';
import { NotificationService } from 'src/notification/notification.service';
import { AlertService } from 'src/alert/alert.service';
import { Role, Users } from 'src/utils/enum/enum';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { SettlementService } from 'src/settlement/settlement.service';
import { CreateSettlementDto } from 'src/settlement/dto/create-settlement.dto';

@Controller('bulletin')
export class BulletinController {
  constructor(
    private bulletinService: BulletinService,
    private notificationService: NotificationService,
    private alertService: AlertService,
    private settlementService: SettlementService,
  ) {}

  @Get('grab-orders/:id')
  getGrabOrders(@Param('id') id: number, @UserInReq() user) {
    return this.bulletinService.getGrabOrders(user.id);
  }

  @Get('pending-orders/:id')
  getPendingOrders(@Param('id') id: number, @UserInReq() user) {
    return this.bulletinService.getPendingOrders(id, user.userId);
  }

  // UPI Vendor endpoints
  @Post('upi-vendor/pending-orders/paginate')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  getUpiVendorPendingOrders(
    @UserInReq() user,
    @Body() paginateRequestDto: PaginateRequestDto,
  ) {
    return this.bulletinService.getUpiVendorPendingOrders(user.id, paginateRequestDto);
  }

  @Get('upi-vendor/notifications')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  getUpiVendorNotifications(@UserInReq() user) {
    return this.notificationService.getMyNotifications(+user.id);
  }

  @Post('upi-vendor/notifications/mark-read')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  markUpiVendorNotificationRead(
    @UserInReq() user,
    @Body() body: { notificationsIds: number[] },
  ) {
    return this.notificationService.markNotificationRead(user.id, body);
  }

  @Get('upi-vendor/alerts')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  getUpiVendorAlerts(@UserInReq() user) {
    return this.alertService.getMyAlerts({
      id: user.id,
      userType: Users.UPI_VENDOR,
    });
  }

  @Post('upi-vendor/alerts/mark-read')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  markUpiVendorAlertRead(@Body() body: { id: number }) {
    return this.alertService.markAlertRead(body.id);
  }

  // Settlement endpoints
  @Get('upi-vendor/settlement/topup-channels')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  getSettlementTopupChannels(@UserInReq() user) {
    return this.settlementService.getTopupChannels(user.id);
  }

  @Post('upi-vendor/settlement')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  createSettlement(
    @Body() createSettlementDto: CreateSettlementDto,
    @UserInReq() user,
  ) {
    return this.settlementService.create(createSettlementDto, user.id);
  }

  @Post('upi-vendor/settlement/paginate')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  paginateSettlements(@UserInReq() user, @Body() paginateDto: PaginateRequestDto) {
    return this.settlementService.paginate(user.id, paginateDto);
  }

  @Post('upi-vendor/settlement/submitted/paginate')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  paginateSubmittedSettlements(
    @UserInReq() user,
    @Body() paginateDto: PaginateRequestDto,
  ) {
    return this.settlementService.paginateSubmitted(user.id, paginateDto);
  }

  @Get('upi-vendor/settlement/:id')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  getSettlement(@Param('id') id: string, @UserInReq() user) {
    return this.settlementService.findOne(+id, user.id);
  }

  @Get('upi-vendor/get-details-for-settlement')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  getDetailsForSettlement(@UserInReq() user) {
    return this.bulletinService.getDetailsForSettlement(user.id);
  }
}
