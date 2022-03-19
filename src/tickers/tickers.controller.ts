import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import CreateTickerDto from './dto/create.ticker';
import { Ticker } from './tickers.model';
import { TickersSeederService } from './tickers.seeder.service';
import { TickersService } from './tickers.service';

@Controller('tickers')
export class TickersController {
  constructor(
    private tickersService: TickersService,
    private tickersSeederService: TickersSeederService,
  ) {}
  @Post()
  create(@Body() createTickerDto: CreateTickerDto): Promise<Ticker> {
    return this.tickersService.create(createTickerDto);
  }
  @Post('/seed')
  seed() {
    return this.tickersSeederService.seed();
  }
  @Get()
  find(@Query('q') query: string) {
    return this.tickersService.find(query);
  }
}
