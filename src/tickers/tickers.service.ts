import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { Like, Repository } from 'typeorm';
import CreateTickerDto from './dto/create.ticker';
import { Ticker } from './tickers.model';

@Injectable()
export class TickersService {
  constructor(
    @InjectRepository(Ticker)
    private tickersRepository: Repository<Ticker>,
    private usersService: UsersService,
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

  async getTickersByUserId(userId: number): Promise<Ticker[]> {
    const user = await this.usersService.findByUserId(userId);

    return user.tickers;
  }

  async createTickerOfUser(
    userId: number,
    createTickerDto: CreateTickerDto[],
  ): Promise<Ticker[]> {
    const user = await this.usersService.findByUserId(userId);

    const tickers = [];

    createTickerDto.forEach(async (el) => {
      const ticker = await this.tickersRepository.findOne({ id: el.name });

      console.log(ticker);

      tickers.push(ticker);
    });

    user.tickers = tickers;

    const updatedUser = await this.usersService.save(user);

    return updatedUser.tickers;
  }
}
