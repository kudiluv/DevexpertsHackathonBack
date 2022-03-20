import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
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

  @Auth()
  @Post('favorits')
  addToFavorits(@Request() req, @Body() createTickerDtos: CreateTickerDto[]) {
    return this.tickersService.createTickerOfUser(
      req.user.id,
      createTickerDtos,
    );
  }

  @Auth()
  @Get('favorits')
  @UsePipes()
  getFavorits(@Request() req): Promise<Ticker[]> {
    return this.tickersService.getTickersByUserId(req.user.id);
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
