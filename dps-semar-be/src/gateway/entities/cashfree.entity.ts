import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cashfree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  incoming: boolean;

  @Column()
  outgoing: boolean;

  @Column()
  client_id: string;

  @Column()
  client_secret: string;

  @Column({ nullable: true })
  payouts_client_id: string;

  @Column({ nullable: true })
  payouts_client_secret: string;

  @Column()
  sandbox_client_id: string;

  @Column()
  sandbox_client_secret: string;
}
