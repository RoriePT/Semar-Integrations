import { Module } from '@nestjs/common';
import { PayuService } from './payu.service';
import { HttpModule } from '@nestjs/axios';
import { Payu } from 'src/gateway/entities/payu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from 'src/services/jwt/jwt.module';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { Payin } from 'src/payin/entities/payin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payu, EndUser, Payin]),
    HttpModule,
    JwtModule,
  ],
  providers: [PayuService],
  exports: [PayuService],
})
export class PayuModule {}
