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
}
