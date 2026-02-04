import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EndUser } from './entities/end-user.entity';
import { Repository } from 'typeorm';
import { CreateEndUserDto } from './dto/create-end-user.dto';
import {
  PaginateRequestDto,
  parseEndDate,
  parseStartDate,
} from 'src/utils/dtos/paginate.dto';
import { plainToInstance } from 'class-transformer';
import { EndUserPaginateResponseDto } from './dto/paginate-response.dto';
import { parseUserChannelDetails } from 'src/utils/utils';
import { paginateAndClamp } from 'src/utils/pagination.util';

@Injectable()
export class EndUserService {
  constructor(
    @InjectRepository(EndUser)
    private readonly endUserRepository: Repository<EndUser>,
  ) {}

  async create(createEndUserDto: CreateEndUserDto) {
    const endUser = await this.endUserRepository.save({
      ...createEndUserDto,
    });

    return endUser;
  }

  async findOne(id) {
    const endUser = await this.endUserRepository.findOne({
      where: { id },
      relations: [],
    });

    if (!endUser) throw new NotFoundException('End user not found!');

    return endUser;
  }

  async findAll() {
    const endUsers = await this.endUserRepository.find({
      relations: [],
    });

    return endUsers;
  }

  async paginate(paginateDto: PaginateRequestDto) {
    const query = this.endUserRepository.createQueryBuilder('endUser');
    query.leftJoinAndSelect('endUser.merchant', 'merchant');

    const search = paginateDto.search;
    const pageSize = paginateDto.pageSize;
    const pageNumber = paginateDto.pageNumber;
    const sortBy = paginateDto.sortBy;

    if (search) {
      query.andWhere(
        `(
        CONCAT("merchant"."first_name", ' ', "merchant"."last_name", ' ', "endUser"."name", ' ', "endUser"."mobile") ILIKE :search
      )`,
        { search: `%${search}%` },
      );
    }

    if (paginateDto.startDate && paginateDto.endDate) {
      const startDate = parseStartDate(paginateDto.startDate);
      const endDate = parseEndDate(paginateDto.endDate);

      query.andWhere('endUser.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (sortBy)
      sortBy === 'latest'
        ? query.orderBy('endUser.createdAt', 'DESC')
        : query.orderBy('endUser.createdAt', 'ASC');

    const { rows, meta } = await paginateAndClamp(query, {
      pageNumber,
      pageSize,
    });

    const dtos = rows.map((row) => {
      return plainToInstance(EndUserPaginateResponseDto, {
        ...row,
        channelDetails: parseUserChannelDetails(row),
      });
    });

    return {
      total: meta.total,
      page: meta.page,
      pageSize: meta.pageSize,
      totalPages: meta.totalPages,
      startRecord: meta.startRecord,
      endRecord: meta.endRecord,
      data: dtos,
    };
  }

  async toggleBlacklisted(id: number) {
    const user = await this.endUserRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found!');

    await this.endUserRepository.update(user.id, {
      isBlacklisted: !user.isBlacklisted,
    });

    return HttpStatus.OK;
  }

  async getEndUserDetails(id: string) {
    const endUser = await this.endUserRepository.findOne({
      where: { userId: id },
    });
    if (!endUser) throw new NotFoundException('End user not found!');

    return {
      userName: endUser.name,
      userId: endUser.userId,
      userEmail: endUser?.email || '',
      userMobile: endUser?.mobile || '',
    };
  }
}
