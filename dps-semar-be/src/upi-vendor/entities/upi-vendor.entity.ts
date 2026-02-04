import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Identity } from 'src/identity/entities/identity.entity';
import { Payin } from 'src/payin/entities/payin.entity';
import { Settlement } from 'src/settlement/entities/settlement.entity';

@Entity()
export class UpiVendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'float', nullable: true, default: 0 })
  commissionRate: number;

  @Column({ nullable: true })
  settlementUpiId: string;

  @Column({ default: false })
  isOnline: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Identity, (identity) => identity.upiVendor)
  @JoinColumn({ name: 'identity' })
  identity: Identity;

  @OneToMany(() => Payin, (payin) => payin.upiVendor, { nullable: true })
  payin: Payin[];

  @OneToMany(() => Settlement, (settlement) => settlement.upiVendor, {
    nullable: true,
  })
  settlements: Settlement[];
}
