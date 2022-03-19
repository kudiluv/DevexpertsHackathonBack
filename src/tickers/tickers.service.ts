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
  create(createTickerDto: CreateTickerDto): Promise<Ticker> {
    return this.tickersRepository.save({ id: createTickerDto.name });
  }

  find(name: string): Promise<Ticker[]> {
    return this.tickersRepository.find({
      id: Like(`%${name}%`),
    });
  }
}
