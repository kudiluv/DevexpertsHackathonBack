import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { RangeDto } from './dto/range.dto';
import { ShowTickerInfoDto } from './dto/show.ticker.info.dto';
import { ShowTickerPrice } from './dto/show.ticker.price.dto';
import { YahooFinanceService } from './yahoo-finance.service';

@UseInterceptors(CacheInterceptor)
@Controller('yahoo-finance')
export class YahooFinanceController {
  constructor(private yahooFinanceService: YahooFinanceService) {}

  @Get('tickers/info/:tickers')
  getTickersInfo(
    @Param('tickers') tickers: string,
  ): Observable<ShowTickerInfoDto[]> {
    const yahooInfo = this.yahooFinanceService.getTickersListInfo(tickers);
    return yahooInfo;
  }

  @ApiParam({ name: 'range', enum: RangeDto })
  @ApiParam({ name: 'interval', enum: RangeDto })
  @Get('tickers/price/:tickers/:range/:interval')
  getTickersPrice(
    @Param('tickers') tickers: string,
    @Param('range') range: RangeDto,
    @Param('interval') interval: RangeDto,
  ): Observable<ShowTickerPrice[]> {
    console.log('not cached');
    return this.yahooFinanceService.getActualPrices(tickers, range, interval);
  }
}
