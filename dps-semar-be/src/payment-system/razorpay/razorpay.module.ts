import { Module } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { Razorpay } from 'src/gateway/entities/razorpay.entity';
import { JwtModule } from 'src/services/jwt/jwt.module';
import { Identity } from 'src/identity/entities/identity.entity';
import { Payin } from 'src/payin/entities/payin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EndUser, Razorpay, Identity, Payin]),
    HttpModule,
    JwtModule,
  ],
  providers: [RazorpayService],
  exports: [RazorpayService],
})
export class RazorpayModule {}
