import { User } from 'src/users/users.model';
import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Ticker {
  @PrimaryColumn({
    type: String,
  })
  id: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'tickers_users',
  })
  users: User[];
}
