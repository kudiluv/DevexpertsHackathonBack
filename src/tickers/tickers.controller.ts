import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import CreateTickerDto from './dto/create.ticker';
import { Ticker } from './tickers.model';
import { TickersSeederService } from './tickers.seeder.service';
import { TickersService } from './tickers.service';

@ApiTags('tickers')
@Controller('tickers')
export class TickersController {
  constructor(
    private tickersService: TickersService,
    private tickersSeederService: TickersSeederService,
  ) {}

  @Post('favorits')
  addToFavorits(
    @Body() createTickerDtos: CreateTickerDto[],
  ): Promise<Ticker[]> {
    return this.tickersService.create(createTickerDtos);
  }

  @Get('favorits')
  getFavorits(): Promise<Ticker[]> {
    return this.tickersSeederService.getTickersByUserId();
  }

  @Post('seed')
  seed() {
    return this.tickersSeederService.seed();
  }

  @Get()
  find(@Query('q') query: string) {
    return this.tickersService.find(query);
  }
}
