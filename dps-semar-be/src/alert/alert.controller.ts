import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { AlertCreateDto } from './dto/alert-create.dto';
import { AlertService } from './alert.service';
import { Role, Users } from 'src/utils/enum/enum';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { UserInReq } from 'src/utils/decorators/user-in-req.decorator';
import { PaginateRequestDto } from 'src/utils/dtos/paginate.dto';

@Controller('alert')
@UseGuards(RolesGuard)
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Post('create')
  @Roles(
    Role.MERCHANT,
    Role.MEMBER,
    Role.AGENT,
    Role.SUB_ADMIN,
    Role.SUPER_ADMIN,
    Role.UPI_VENDOR,
  )
  create(@Body() alertCreateDto: AlertCreateDto) {
    return this.alertService.create(alertCreateDto);
  }

  @Post('paginate')
  @Roles(Role.SUB_ADMIN, Role.SUPER_ADMIN)
  paginate(@Body() body: PaginateRequestDto) {
    return this.alertService.paginate(body);
  }

  @Post()
  @Roles(
    Role.MERCHANT,
    Role.MEMBER,
    Role.AGENT,
    Role.SUB_ADMIN,
    Role.SUPER_ADMIN,
    Role.UPI_VENDOR,
  )
  getMyAlerts(@UserInReq() user, @Body() body: { userType?: Users | string }) {
    // Infer userType from authenticated user's token if not provided or invalid
    let normalizedUserType: Users;
    
    if (body.userType) {
      const userTypeStr = String(body.userType);
      // Normalize userType: convert various formats to enum value
      if (userTypeStr === 'UPI Vendor' || userTypeStr === 'UPI_VENDOR') {
        normalizedUserType = Users.UPI_VENDOR;
      } else if (Object.values(Users).includes(userTypeStr as Users)) {
        normalizedUserType = userTypeStr as Users;
      } else {
        // Fallback to inferring from user token
        normalizedUserType = this.inferUserTypeFromToken(user);
      }
    } else {
      // Infer from user token if not provided
      normalizedUserType = this.inferUserTypeFromToken(user);
    }
    
    return this.alertService.getMyAlerts({
      id: user.id,
      userType: normalizedUserType,
    });
  }

  private inferUserTypeFromToken(user: any): Users {
    const userType = user?.type?.toLowerCase();
    
    if (userType === 'merchant' || userType === 'sub_merchant') {
      return Users.MERCHANT;
    } else if (userType === 'member') {
      return Users.MEMBER;
    } else if (userType === 'agent') {
      return Users.AGENT;
    } else if (userType === 'upi_vendor' || userType === 'upivendor') {
      return Users.UPI_VENDOR;
    } else if (userType === 'super_admin' || userType === 'sub_admin') {
      return Users.ADMIN;
    }
    
    // Default fallback
    return Users.MEMBER;
  }

  @Put('mark-read')
  @Roles(
    Role.MERCHANT,
    Role.MEMBER,
    Role.AGENT,
    Role.SUB_ADMIN,
    Role.SUPER_ADMIN,
    Role.UPI_VENDOR,
  )
  markAlertRead(@Body() body: { id: number }) {
    return this.alertService.markAlertRead(body.id);
  }
}
