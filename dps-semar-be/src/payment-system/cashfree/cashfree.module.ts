import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { JwtModule } from 'src/services/jwt/jwt.module';
import { Identity } from 'src/identity/entities/identity.entity';
import { Cashfree } from 'src/gateway/entities/cashfree.entity';
import { CashfreeService } from './cashfree.service';
import { Payout } from 'src/payout/entities/payout.entity';
import { IdentityModule } from 'src/identity/identity.module';
import { Payin } from 'src/payin/entities/payin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EndUser, Cashfree, Identity, Payout, Payin]),
    HttpModule,
    JwtModule,
    IdentityModule,
  ],
  providers: [CashfreeService],
  exports: [CashfreeService],
})
export class CashfreeModule {}
