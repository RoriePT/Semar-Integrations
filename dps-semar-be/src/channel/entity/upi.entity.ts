import { Identity } from 'src/identity/entities/identity.entity';
import { Settlement } from 'src/settlement/entities/settlement.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Upi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  upiId: string;

  @Column()
  mobile: string;

  @Column({ nullable: true, default: false })
  isBusinessUpi: boolean;

  @Column({ default: 0 })
  channelIndex: number;

  @Column({ nullable: true })
  beneficiaryName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, default: true })
  enabled: boolean;

  @Column({ nullable: true, default: '' })
  title: string;

  @Column({ default: false, nullable: true })
  isUpiVendor: boolean;

  @Column({ type: 'float', nullable: true, default: 0 })
  settlementAmount: number;

  @ManyToOne(() => Identity, (identity) => identity.upi)
  identity: Identity;

  @OneToMany(() => Settlement, (settlement) => settlement.upi, {
    nullable: true,
  })
  settlements: Settlement[];

  @Column({ nullable: true, default: null })
  tr: string;
}
