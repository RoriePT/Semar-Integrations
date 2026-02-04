import {
  ChannelName,
  GatewayName,
  OrderStatus,
  PaymentMadeOn,
} from 'src/utils/enum/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PayinSandbox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  systemOrderId: string;

  @Column()
  merchantOrderId: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.INITIATED })
  status: OrderStatus;

  @Column({ type: 'enum', enum: ChannelName })
  channel: ChannelName;

  @Column({ type: 'enum', enum: PaymentMadeOn, nullable: true })
  payinMadeOn: PaymentMadeOn;

  @Column({ nullable: true, type: 'enum', enum: GatewayName })
  gatewayName: GatewayName;

  @Column({ type: 'float', nullable: true })
  gatewayServiceRate: number;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  transactionReceipt: string;

  @Column({ nullable: true })
  transactionDetails: string;

  @Column({ type: String, nullable: true })
  gatewayPaymentLink: string;

  @Column({ type: 'json' })
  user: {
    name: string;
    mobile?: string | null;
    email?: string | null;
    userId: string;
  };

  @Column({ type: 'json' })
  merchant: {
    id: number;
    name: string;
  };

  @Column({ type: 'json', nullable: true })
  member: {
    name: string;
  };

  @Column({ nullable: true })
  trackingId: string;

  @Column({ nullable: true })
  successUrl: string;

  @Column({ nullable: true })
  failureUrl: string;

  @Column({ nullable: true })
  webhookUrl: string;

  @Column({ nullable: true })
  mode: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
