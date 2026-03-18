import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from './entity/config.entity';
import { UpdateChannelConfigDto } from './dto/update-channel-config.dto';
import { ChannelName, OrderType } from 'src/utils/enum/enum';
import { getChannelData } from './data/channel.data';
import { ChannelListDto } from './dto/channel-list.dto';
import { Merchant } from 'src/merchant/entities/merchant.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Config)
    private readonly configChannelRepository: Repository<Config>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
  ) {}

  async createChannelConfig() {
    const existingConfigs = await this.configChannelRepository.find();
    const existingNames = new Set(existingConfigs.map((item) => item.name));
    const channelConfigData = getChannelData();
    const missingConfigs = channelConfigData.filter(
      (dto) => !existingNames.has(dto.name),
    );

    if (missingConfigs.length === 0) {
      return HttpStatus.OK;
    }

    const channelConfigs = missingConfigs.map((dto) =>
      this.configChannelRepository.create(dto),
    );
    await this.configChannelRepository.save(channelConfigs);
    return HttpStatus.CREATED;
  }

  async updateChannelConfig(updateChannelConfigDto: UpdateChannelConfigDto) {
    const name = updateChannelConfigDto.name;

    const existingConfig = await this.configChannelRepository.findOneBy({
      name: name,
    });

    delete updateChannelConfigDto.name;

    if (!existingConfig) throw new NotFoundException('Channel not found');

    existingConfig.incoming = updateChannelConfigDto.incoming;
    existingConfig.outgoing = updateChannelConfigDto.outgoing;

    await this.configChannelRepository.save(existingConfig);

    return HttpStatus.ACCEPTED;
  }

  async getAllConfig() {
    return await this.configChannelRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async getConfig(name: ChannelName) {
    const config = await this.configChannelRepository.findOneBy({
      name: name,
    });

    if (!config) throw new NotFoundException('Confuguration not found.');

    return config;
  }

  async getChannelList(body: ChannelListDto) {
    const { orderType, merchantId } = body;
    const channels = await this.configChannelRepository.find();

    const merchant = merchantId
      ? await this.merchantRepository.findOne({
          where: {
            id: merchantId,
          },
          relations: [
            'identity',
            'identity.upi',
            'identity.eWallet',
            'identity.netBanking',
          ],
        })
      : null;

    if (orderType === OrderType.PAYIN || orderType === OrderType.TOPUP)
      return channels.map((channel) => ({
        channel: channel.name,
        enabled: merchantId
          ? JSON.stringify(merchant?.payinChannels)?.includes(channel.name) &&
            channel.incoming
          : channel.incoming,
      }));

    const mapChannel = {
      UPI: 'upi',
      QRIS: 'upi',
      NET_BANKING: 'netBanking',
      E_WALLET: 'eWallet',
    };

    if (orderType === OrderType.WITHDRAWAL) {
      return channels.map((channel) => ({
        channel: channel.name,
        enabled: merchantId
          ? mapChannel[channel.name]
            ? merchant.identity[mapChannel[channel.name]]?.length >= 1 &&
              channel.outgoing
            : channel.outgoing
          : channel.outgoing,
      }));
    }

    return channels.map((channel) => ({
      channel: channel.name,
      enabled: merchantId
        ? JSON.stringify(merchant?.payoutChannels)?.includes(channel.name) &&
          channel.outgoing
        : channel.outgoing,
    }));
  }
}
