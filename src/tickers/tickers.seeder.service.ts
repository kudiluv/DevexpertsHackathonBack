import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticker } from './tickers.model';
import seedData from './seed.teakers';

@Injectable()
export class TickersSeederService {
  constructor(
    @InjectRepository(Ticker)
    private tickersRepository: Repository<Ticker>,
  ) {}

  seed(): Promise<Ticker[]> {
    return this.tickersRepository.save(seedData);
  }
}
