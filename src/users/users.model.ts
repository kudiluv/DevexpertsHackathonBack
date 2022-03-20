import { Ticker } from 'src/tickers/tickers.model';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @ManyToMany(() => Ticker)
  @JoinTable({
    name: 'tickers_users',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ticker_id',
      referencedColumnName: 'id',
    },
  })
  tickers: Ticker[];
}
