import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, In, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { MemberService } from 'src/member/member.service';
import { Member } from 'src/member/entities/member.entity';
import { UpiVendor } from 'src/upi-vendor/entities/upi-vendor.entity';
import { NotificationReadStatus, Users } from 'src/utils/enum/enum';
import { MarkNotificationReadDto } from './dto/mark-notification-read.dto';
import { SocketGateway } from 'src/socket/socket.gateway';
import { getTextForNotification } from 'src/utils/utils';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(UpiVendor)
    private upiVendorRepository: Repository<UpiVendor>,
    private socketGateway: SocketGateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { type, data, for: userId } = createNotificationDto;

    // If a specific user ID is provided, send to that user only
    if (userId) {
      try {
        const createdNotification = await this.notificationRepository.save(
          createNotificationDto,
        );

        // Determine user type - check if it's a UPI vendor or member
        const upiVendor = await this.upiVendorRepository.findOne({
          where: { id: userId },
        });

        const userType = upiVendor ? Users.UPI_VENDOR : Users.MEMBER;

        await this.socketGateway.handleSendNotification({
          for: userId,
          userType,
          type,
          data,
          id: createdNotification.id,
        });

        return HttpStatus.CREATED;
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    } else {
      // Send to all online members (existing behavior)
      const onlineMembers = await this.memberRepository.find({
        where: {
          isOnline: true,
        },
      });

      try {
        const notifications = onlineMembers.map(async (member) => {
          const createdNotification = await this.notificationRepository.save({
            ...createNotificationDto,
            for: member.id,
          });

          await this.socketGateway.handleSendNotification({
            for: member.id,
            userType: Users.MEMBER,
            type,
            data,
            id: createdNotification.id,
          });
        });

        await Promise.all(notifications);

        return HttpStatus.CREATED;
      } catch (error) {
        console.error('Error creating notifications:', error);
      }
    }
  }

  async getMyNotifications(id: number) {
    // Check if user is a member or UPI vendor
    const member = await this.memberRepository.findOneBy({ id });
    const upiVendor = await this.upiVendorRepository.findOneBy({ id });

    if (!member && !upiVendor)
      throw new NotFoundException('User not found.');

    const myNotifications = await this.notificationRepository.find({
      where: {
        for: id,
        status: NotificationReadStatus.UNREAD,
      },
    });

    return myNotifications.map((item) => ({
      id: item.id,
      type: item.type,
      text: getTextForNotification(item.type, item.data),
      date: item.createdAt,
      data: item.data,
    }));
  }

  async markNotificationRead(
    id: number,
    markNotificationReadDto: MarkNotificationReadDto,
  ) {
    const { notificationsIds } = markNotificationReadDto;
    
    // Check if user is a member or UPI vendor
    const member = await this.memberRepository.findOneBy({ id });
    const upiVendor = await this.upiVendorRepository.findOneBy({ id });

    if (!member && !upiVendor)
      throw new NotFoundException('User not found.');

    const notifications = await this.notificationRepository.find({
      where: {
        id: In(notificationsIds),
        for: id,
      },
    });

    if (notifications.length === 0) {
      throw new NotFoundException(
        'No notifications found for the specified IDs.',
      );
    }

    notifications.forEach(async (notification) => {
      notification.status = NotificationReadStatus.READ;
      await this.notificationRepository.save(notification);
    });

    return HttpStatus.OK;
  }
}
