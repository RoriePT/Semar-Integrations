import { Exclude, Expose, Transform } from 'class-transformer';
import { Identity } from 'src/identity/entities/identity.entity';

@Exclude()
export class SubMerchantResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.identity.email, { toClassOnly: true })
  email: string;

  @Exclude()
  identity: Identity;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;

  @Expose()
  id: number;

  @Expose()
  enabled: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  permissionSubmitPayouts: boolean;

  @Expose()
  permissionSubmitWithdrawals: boolean;

  @Expose()
  permissionUpdateWithdrawalProfiles: boolean;

  @Expose()
  @Transform(({ obj }) => obj.merchantName, {
    toClassOnly: true,
  })
  merchantName: string;

  @Expose()
  @Transform(({ obj }) => obj.businessName, {
    toClassOnly: true,
  })
  businessName: string;
}
