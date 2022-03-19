import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ticker {
  @PrimaryGeneratedColumn()
  id: string;
}
