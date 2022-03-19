import { Body, Controller, Post } from '@nestjs/common';
import CreateTickerDto from './dto/create.ticker';
import { Ticker } from './tickers.model';
import { TickersService } from './tickers.service';

@Controller('tickers')
export class TickersController {
  constructor(private tickersService: TickersService) {}
  @Post()
  create(@Body() createTickerDto: CreateTickerDto): Promise<Ticker> {
    return this.tickersService.create(createTickerDto);
  }
}
