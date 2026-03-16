import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from 'src/services/jwt/jwt.module';
import { XenditService } from './xendit.service';
import { Xendit } from 'src/gateway/entities/xendit.entity';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { Identity } from 'src/identity/entities/identity.entity';
import { Payout } from 'src/payout/entities/payout.entity';
import { Payin } from 'src/payin/entities/payin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Xendit, EndUser, Identity, Payout, Payin]),
    HttpModule,
    JwtModule,
  ],
  providers: [XenditService],
  exports: [XenditService],
})
export class XenditModule {}
