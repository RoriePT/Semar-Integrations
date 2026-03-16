import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateRazorpayDto } from './dto/create-razorpay.dto';
import { JwtService } from 'src/services/jwt/jwt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Razorpay } from './entities/razorpay.entity';
import { Repository } from 'typeorm';
import { UpdatePhonepDto } from './dto/create-phonepe.dto';
import { Phonepe } from './entities/phonepe.entity';
import { UpdateChannelSettingsDto } from './dto/create-channel-settings.dto';
import { ChannelSettings } from './entities/channel-settings.entity';
import { plainToInstance } from 'class-transformer';
import { GatewayResponseDto } from './dto/gateway-response.dto';
import { loadChannelData } from './data/channel.data';
import { GetChannelSettingsDto } from './dto/get-channel-settings.dto';
import {
  loadCashfreeData,
  loadDokuData,
  loadMidtransData,
  loadPayuData,
  loadPhonepeData,
  loadRazorpayData,
  loadUniqpayData,
  loadXenditData,
} from './data/gateway.data';
import { Uniqpay } from './entities/uniqpay.entity';
import { UpdateUniqpayDto } from './dto/create-uniqpay.dto';
import { Payu } from './entities/payu.entity';
import { UpdatePayuDto } from './dto/create-payu.dto';
import { UpdateCashfreeDto } from './dto/create-cashfree.dto';
import { Cashfree } from './entities/cashfree.entity';
import { Doku } from './entities/doku.entity';
import { Midtrans } from './entities/midtrans.entity';
import { Xendit } from './entities/xendit.entity';
import { UpdateDokuDto } from './dto/create-doku.dto';
import { UpdateMidtransDto } from './dto/create-midtrans.dto';
import { UpdateXenditDto } from './dto/create-xendit.dto';

@Injectable()
export class GatewayService {
  constructor(
    @InjectRepository(ChannelSettings)
    private readonly channelSettingsRepository: Repository<ChannelSettings>,
    @InjectRepository(Razorpay)
    private readonly razorpayRepository: Repository<Razorpay>,
    @InjectRepository(Phonepe)
    private readonly phonepeRepository: Repository<Phonepe>,
    @InjectRepository(Uniqpay)
    private readonly uniqpayRepository: Repository<Uniqpay>,
    @InjectRepository(Payu)
    private readonly payuRepository: Repository<Payu>,
    @InjectRepository(Cashfree)
    private readonly cashfreeRepository: Repository<Cashfree>,
    @InjectRepository(Doku)
    private readonly dokuRepository: Repository<Doku>,
    @InjectRepository(Midtrans)
    private readonly midtransRepository: Repository<Midtrans>,
    @InjectRepository(Xendit)
    private readonly xenditRepository: Repository<Xendit>,

    private jwtService: JwtService,
  ) {}

  secretTextKeysRazorpay = [
    'key_secret',
    'key_id',
    'sandbox_key_id',
    'sandbox_key_secret',
    'account_number',
    'sandbox_account_number',
  ];

  secretTextKeysUniqpay = ['uniqpay_id', 'client_id', 'client_secret'];

  secretTextKeysPhonepe = [
    'merchant_id',
    'sandbox_salt_index',
    'sandbox_salt_key',
    'sandbox_merchant_id',
    'salt_index',
    'salt_key',
  ];

  secretTextKeysPayu = [
    'client_id',
    'client_secret',
    'merchant_id',
    'sandbox_client_id',
    'sandbox_client_secret',
    'sandbox_merchant_id',
  ];

  secretTextKeysCashfree = [
    'client_id',
    'client_secret',
    'payouts_client_id',
    'payouts_client_secret',
    'sandbox_client_id',
    'sandbox_client_secret',
  ];

  secretTextKeysDoku = [
    'merchant_id',
    'client_id',
    'secret_key',
    'sandbox_merchant_id',
    'sandbox_client_id',
    'sandbox_secret_key',
  ];

  secretTextKeysMidtrans = [
    'server_key',
    'client_key',
    'sandbox_server_key',
    'sandbox_client_key',
  ];

  secretTextKeysXendit = ['secret_key', 'sandbox_secret_key'];

  async createRazorPay() {
    const isGatewayExists = await this.razorpayRepository.find();

    const createRazorPayDto = loadRazorpayData();

    if (isGatewayExists?.length > 0) throw new ConflictException();

    const secretTextKeys = this.secretTextKeysRazorpay;

    secretTextKeys.forEach((key) => {
      secretTextKeys.forEach((key) => {
        createRazorPayDto[key] = this.jwtService.encryptValue(
          createRazorPayDto[key],
        );
      });
    });

    await this.razorpayRepository.save(createRazorPayDto);
  }

  async getRazorpay() {
    const razorpayData = await this.razorpayRepository.find();
    if (!razorpayData) throw new NotFoundException();
    const result = plainToInstance(GatewayResponseDto, razorpayData[0]);
    return result;
  }

  async updateRazorpay(updateRazorpayDto: UpdateRazorpayDto) {
    const secretTextKeys = this.secretTextKeysRazorpay;

    const existingData = await this.razorpayRepository.find();
    if (!existingData) throw new NotFoundException();

    const updatedData = Object.assign({}, existingData[0], updateRazorpayDto);

    secretTextKeys.forEach((key) => {
      if (updateRazorpayDto[key]) {
        updatedData[key] = this.jwtService.encryptValue(updatedData[key]);
      }
    });

    await this.razorpayRepository.update(existingData[0].id, updatedData);
    return HttpStatus.OK;
  }

  async createPhonepe() {
    const isGatewayExists = await this.phonepeRepository.find();
    const createPhonepeDto = loadPhonepeData();

    if (isGatewayExists?.length > 0) throw new ConflictException();

    const phonepeSecretKeys = this.secretTextKeysPhonepe;

    phonepeSecretKeys.forEach((key) => {
      createPhonepeDto[key] = this.jwtService.encryptValue(
        createPhonepeDto[key],
      );
    });

    await this.phonepeRepository.save(createPhonepeDto);
  }

  async getPhonepe() {
    const phonepeData = await this.phonepeRepository.find();
    if (!phonepeData) throw new NotFoundException();
    const result = plainToInstance(GatewayResponseDto, phonepeData[0]);
    return result;
  }

  async updatePhonepe(updatePhonepeDto: UpdatePhonepDto) {
    const secretKeysPhonepe = this.secretTextKeysPhonepe;

    const existingData = await this.phonepeRepository.find();
    if (!existingData) throw new NotFoundException();

    const updatedData = Object.assign({}, existingData[0], updatePhonepeDto);

    secretKeysPhonepe.forEach((key) => {
      if (updatePhonepeDto[key]) {
        updatedData[key] = this.jwtService.encryptValue(updatePhonepeDto[key]);
      }
    });

    await this.phonepeRepository.update(existingData[0].id, updatedData);
    return HttpStatus.OK;
  }

  async createUniqpay() {
    const isGatewayExists = await this.uniqpayRepository.find();

    const createUniqpayDto = loadUniqpayData();

    if (isGatewayExists?.length > 0) throw new ConflictException();

    const secretTextKeys = this.secretTextKeysUniqpay;

    secretTextKeys.forEach((key) => {
      createUniqpayDto[key] = this.jwtService.encryptValue(
        createUniqpayDto[key],
      );
    });

    await this.uniqpayRepository.save(createUniqpayDto);
  }

  async getUniqpay() {
    const uniqpayData = await this.uniqpayRepository.find();
    if (!uniqpayData) throw new NotFoundException();
    const result = plainToInstance(GatewayResponseDto, uniqpayData[0]);
    return result;
  }

  async updateUniqpay(updateUniqpayDto: UpdateUniqpayDto) {
    const secretTextKeys = this.secretTextKeysUniqpay;

    const existingData = await this.uniqpayRepository.find();
    if (!existingData) throw new NotFoundException();

    const updatedData = Object.assign({}, existingData[0], updateUniqpayDto);

    secretTextKeys.forEach((key) => {
      if (updateUniqpayDto[key])
        updatedData[key] = this.jwtService.encryptValue(updatedData[key]);
    });

    await this.uniqpayRepository.update(existingData[0]?.id, updatedData);
    return HttpStatus.OK;
  }

  async createPayu() {
    const isGatewayExists = await this.payuRepository.find();

    const createPayuDto = loadPayuData();

    if (isGatewayExists?.length > 0) throw new ConflictException();

    const secretTextKeys = this.secretTextKeysPayu;

    secretTextKeys.forEach((key) => {
      createPayuDto[key] = this.jwtService.encryptValue(createPayuDto[key]);
    });

    await this.payuRepository.save(createPayuDto);
  }

  async getPayu() {
    const payuData = await this.payuRepository.find();
    if (!payuData) throw new NotFoundException();

    const result = plainToInstance(GatewayResponseDto, payuData[0]);
    return result;
  }

  async updatePayu(updatePayuDto: UpdatePayuDto) {
    const secretTextKeys = this.secretTextKeysPayu;

    const existingData = await this.payuRepository.find();
    if (!existingData) throw new NotFoundException();

    const updatedData = Object.assign({}, existingData[0], updatePayuDto);

    secretTextKeys.forEach((key) => {
      if (updatePayuDto[key])
        updatedData[key] = this.jwtService.encryptValue(updatedData[key]);
    });

    await this.payuRepository.update(existingData[0]?.id, updatedData);
    return HttpStatus.OK;
  }

  async createCashfree() {
    const isGatewayExists = await this.cashfreeRepository.find();

    const createCashfreeDto = loadCashfreeData();

    if (isGatewayExists?.length > 0) throw new ConflictException();

    const secretTextKeys = this.secretTextKeysCashfree;

    secretTextKeys.forEach((key) => {
      secretTextKeys.forEach((key) => {
        createCashfreeDto[key] = this.jwtService.encryptValue(
          createCashfreeDto[key],
        );
      });
    });

    await this.cashfreeRepository.save(createCashfreeDto);
  }

  async getCashfree() {
    const cashfreeData = await this.cashfreeRepository.find();
    if (!cashfreeData) throw new NotFoundException();

    const result = plainToInstance(GatewayResponseDto, cashfreeData[0]);
    return result;
  }

  async updateCashfree(updateCashfreeDto: UpdateCashfreeDto) {
    const secretTextKeys = this.secretTextKeysCashfree;

    const existingData = await this.cashfreeRepository.find();
    if (!existingData) throw new NotFoundException();

    const updatedData = Object.assign({}, existingData[0], updateCashfreeDto);

    secretTextKeys.forEach((key) => {
      if (updateCashfreeDto[key])
        updatedData[key] = this.jwtService.encryptValue(updatedData[key]);
    });

    await this.cashfreeRepository.update(existingData[0]?.id, updatedData);
    return HttpStatus.OK;
  }

  async createDoku() {
    const isGatewayExists = await this.dokuRepository.find();
    if (isGatewayExists?.length > 0) throw new ConflictException();

    const createDokuDto = loadDokuData();
    this.secretTextKeysDoku.forEach((key) => {
      createDokuDto[key] = this.jwtService.encryptValue(createDokuDto[key]);
    });

    await this.dokuRepository.save(createDokuDto);
  }

  async getDoku() {
    const dokuData = await this.dokuRepository.find();
    if (!dokuData) throw new NotFoundException();
    return plainToInstance(GatewayResponseDto, dokuData[0]);
  }

  async updateDoku(updateDokuDto: UpdateDokuDto) {
    const existingData = await this.dokuRepository.find();
    if (!existingData) throw new NotFoundException();

    const updatedData = Object.assign({}, existingData[0], updateDokuDto);
    this.secretTextKeysDoku.forEach((key) => {
      if (updateDokuDto[key])
        updatedData[key] = this.jwtService.encryptValue(updatedData[key]);
    });

    await this.dokuRepository.update(existingData[0]?.id, updatedData);
    return HttpStatus.OK;
  }

  async createMidtrans() {
    const isGatewayExists = await this.midtransRepository.find();
    if (isGatewayExists?.length > 0) throw new ConflictException();

    const createMidtransDto = loadMidtransData();
    this.secretTextKeysMidtrans.forEach((key) => {
      createMidtransDto[key] = this.jwtService.encryptValue(
        createMidtransDto[key],
      );
    });

    await this.midtransRepository.save(createMidtransDto);
  }

  async getMidtrans() {
    const midtransData = await this.midtransRepository.find();
    if (!midtransData) throw new NotFoundException();
    return plainToInstance(GatewayResponseDto, midtransData[0]);
  }

  async updateMidtrans(updateMidtransDto: UpdateMidtransDto) {
    const existingData = await this.midtransRepository.find();
    if (!existingData) throw new NotFoundException();

    const updatedData = Object.assign({}, existingData[0], updateMidtransDto);
    this.secretTextKeysMidtrans.forEach((key) => {
      if (updateMidtransDto[key])
        updatedData[key] = this.jwtService.encryptValue(updatedData[key]);
    });

    await this.midtransRepository.update(existingData[0]?.id, updatedData);
    return HttpStatus.OK;
  }

  async createXendit() {
    const isGatewayExists = await this.xenditRepository.find();
    if (isGatewayExists?.length > 0) throw new ConflictException();

    const createXenditDto = loadXenditData();
    this.secretTextKeysXendit.forEach((key) => {
      createXenditDto[key] = this.jwtService.encryptValue(createXenditDto[key]);
    });

    await this.xenditRepository.save(createXenditDto);
  }

  async getXendit() {
    const xenditData = await this.xenditRepository.find();
    if (!xenditData) throw new NotFoundException();
    return plainToInstance(GatewayResponseDto, xenditData[0]);
  }

  async updateXendit(updateXenditDto: UpdateXenditDto) {
    const existingData = await this.xenditRepository.find();
    if (!existingData) throw new NotFoundException();

    const updatedData = Object.assign({}, existingData[0], updateXenditDto);
    this.secretTextKeysXendit.forEach((key) => {
      if (updateXenditDto[key])
        updatedData[key] = this.jwtService.encryptValue(updatedData[key]);
    });

    await this.xenditRepository.update(existingData[0]?.id, updatedData);
    return HttpStatus.OK;
  }

  async getAllChannelsSetting() {
    const channelSettingsExists = await this.channelSettingsRepository.find();

    if (!channelSettingsExists)
      throw new NotFoundException('Channels not found.');

    return channelSettingsExists;
  }

  async getChannelSettings(getChannelSettingsDto: GetChannelSettingsDto) {
    const { channelName, type, gatewayName } = getChannelSettingsDto;

    if (!channelName || !type || !gatewayName) throw new BadRequestException();

    const channelSetting = await this.channelSettingsRepository.findOne({
      where: {
        channelName,
        type,
        gatewayName,
      },
    });

    if (!channelSetting)
      throw new NotFoundException('Channel setting not found.');

    return channelSetting;
  }

  async createChannelSettings() {
    const isDataExists = await this.channelSettingsRepository.find();

    if (isDataExists?.length > 0)
      throw new ConflictException('Data already exists');

    const channelSettings = loadChannelData();

    const channelData = channelSettings.map((channelsetting) =>
      this.channelSettingsRepository.create(channelsetting),
    );

    await this.channelSettingsRepository.save(channelData);
  }

  async updateChannelSettings(
    updateChannelSettingsDto: UpdateChannelSettingsDto,
  ) {
    const { channelName, type, gatewayName } = updateChannelSettingsDto;

    if (!channelName || !type || !gatewayName) throw new BadRequestException();

    const channelsetting = await this.getChannelSettings({
      type,
      channelName,
      gatewayName,
    });

    if (!channelsetting)
      throw new NotFoundException('Channel settings not found.');

    await this.channelSettingsRepository.update(
      channelsetting.id,
      updateChannelSettingsDto,
    );

    return HttpStatus.OK;
  }
}
