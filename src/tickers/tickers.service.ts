import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import CreateTickerDto from './dto/create.ticker';
import { Ticker } from './tickers.model';

@Injectable()
export class TickersService {
  constructor(
    @InjectRepository(Ticker)
    private tickersRepository: Repository<Ticker>,
  ) {}

  create(createTickerDto: CreateTickerDto[]): Promise<Ticker[]> {
    const tickers = createTickerDto.map((el) => {
      const ticker = new Ticker();
      ticker.id = el.name;

      return ticker;
    });

    return this.tickersRepository.save(tickers);
  }

  find(name: string): Promise<Ticker[]> {
    return this.tickersRepository.find({
      id: Like(`%${name}%`),
    });
  }

  // getTickersByUserId(userId: number): Promise<Ticker[]> {
  //   return this.tickersRepository.find({ users: userId });
  // }
}
