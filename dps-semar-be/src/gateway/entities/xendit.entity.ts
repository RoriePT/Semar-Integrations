import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Xendit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  incoming: boolean;

  @Column()
  outgoing: boolean;

  @Column()
  secret_key: string;

  @Column()
  sandbox_secret_key: string;
}
