import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import { CreateUpiVendorDto } from './dto/create-upi-vendor.dto';
import { UpdateUpiVendorDto } from './dto/update-upi-vendor.dto';

import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enum/enum';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { PaginateRequestDto } from 'src/utils/dtos/paginate.dto';
import { UserInReq } from 'src/utils/decorators/user-in-req.decorator';

import { UpiVendorService } from './upi-vendor.service';

@Controller('upi-vendor')
export class UpiVendorController {
  constructor(private readonly upiVendorService: UpiVendorService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() createUpiVendorDto: CreateUpiVendorDto) {
    return this.upiVendorService.create(createUpiVendorDto);
  }

  @Get()
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  findOneForUpiVendor(@UserInReq() user) {
    return this.upiVendorService.findOne(+user.id);
  }

  @Get('all')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  findAll() {
    return this.upiVendorService.findAll();
  }

  @Get('get-details-for-settlement')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  getDetailsForSettlement(@UserInReq() user) {
    return this.upiVendorService.getDetailsForSettlement(user.id);
  }

  @Get('admin/preserved-upi')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  getPreservedUpiDetails() {
    return this.upiVendorService.getPreservedUpiDetails();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.upiVendorService.findOne(+id);
  }

  @Patch()
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  updateForUpiVendor(
    @UserInReq() user,
    @Body() updateUpiVendorDto: UpdateUpiVendorDto,
  ) {
    return this.upiVendorService.update(+user.id, updateUpiVendorDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateUpiVendorDto: UpdateUpiVendorDto,
  ) {
    return this.upiVendorService.update(+id, updateUpiVendorDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.upiVendorService.remove(+id);
  }

  @Post('paginate')
  @Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
  @UseGuards(RolesGuard)
  paginate(@Body() paginateRequestDto: PaginateRequestDto) {
    return this.upiVendorService.paginate(paginateRequestDto);
  }

  @Post('upi-ids/paginate')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  paginateUpiIds(
    @UserInReq() user,
    @Body() paginateRequestDto: PaginateRequestDto,
  ) {
    return this.upiVendorService.paginateUpiIds(user.id, paginateRequestDto);
  }
}
