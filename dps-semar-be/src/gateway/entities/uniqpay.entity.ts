import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Uniqpay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  incoming: boolean;

  @Column()
  outgoing: boolean;

  @Column()
  uniqpay_id: string;

  @Column()
  client_id: string;

  @Column()
  client_secret: string;
}
