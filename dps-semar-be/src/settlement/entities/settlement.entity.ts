import { UpiVendor } from 'src/upi-vendor/entities/upi-vendor.entity';
import { Upi } from 'src/channel/entity/upi.entity';
import { OrderStatus } from 'src/utils/enum/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Settlement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  systemOrderId: string;

  @Column({ type: 'float' })
  settlementAmount: number;

  @Column({ type: 'float' })
  paidAmount: number;

  @Column({ type: 'float', default: 0 })
  remainingAmount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.INITIATED })
  status: OrderStatus;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  topupChannelDetails: string; 

  @ManyToOne(() => UpiVendor, (upiVendor) => upiVendor.settlements)
  @JoinColumn()
  upiVendor: UpiVendor;

  @ManyToOne(() => Upi, (upi) => upi.settlements)
  @JoinColumn()
  upi: Upi;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

