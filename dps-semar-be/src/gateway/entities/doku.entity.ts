import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Doku {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  incoming: boolean;

  @Column()
  outgoing: boolean;

  @Column()
  merchant_id: string;

  @Column()
  client_id: string;

  @Column()
  secret_key: string;

  @Column()
  sandbox_merchant_id: string;

  @Column()
  sandbox_client_id: string;

  @Column()
  sandbox_secret_key: string;
}
