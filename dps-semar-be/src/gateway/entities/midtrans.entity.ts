import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Midtrans {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  incoming: boolean;

  @Column()
  outgoing: boolean;

  @Column()
  server_key: string;

  @Column()
  client_key: string;

  @Column()
  sandbox_server_key: string;

  @Column()
  sandbox_client_key: string;

  @Column({ nullable: true })
  disbursement_merchant_id?: string;

  @Column({ nullable: true })
  disbursement_creator_api_key?: string;

  @Column({ nullable: true })
  disbursement_creator_merchant_key?: string;

  @Column({ nullable: true })
  disbursement_approver_api_key?: string;

  @Column({ nullable: true })
  disbursement_approver_merchant_key?: string;

  @Column({ nullable: true })
  sandbox_disbursement_merchant_id?: string;

  @Column({ nullable: true })
  sandbox_disbursement_creator_api_key?: string;

  @Column({ nullable: true })
  sandbox_disbursement_creator_merchant_key?: string;

  @Column({ nullable: true })
  sandbox_disbursement_approver_api_key?: string;

  @Column({ nullable: true })
  sandbox_disbursement_approver_merchant_key?: string;
}
