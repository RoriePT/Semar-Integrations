import { Exclude, Expose, Transform } from 'class-transformer';
import { Identity } from 'src/identity/entities/identity.entity';

@Exclude()
export class UpiVendorResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.identity.email, { toClassOnly: true })
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  @Transform(({ obj }) => obj.phone ?? null, { toClassOnly: true })
  phone: string | null;

  @Expose()
  id: number;

  @Expose()
  enabled: boolean;

  @Expose()
  commissionRate: number;

  @Expose()
  settlementUpiId: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(
    ({ obj }) => {
      return obj.identity?.upi || [];
    },
    { toClassOnly: true },
  )
  upiIds: any[];

  @Exclude()
  identity: Identity;
}
