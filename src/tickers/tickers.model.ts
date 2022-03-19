import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ticker {
  @PrimaryColumn({
    type: String,
  })
  id: string;
}
