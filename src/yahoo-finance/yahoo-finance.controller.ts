import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CacheInterceptor,
  Controller,
  Get,
  HttpException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RangeDto } from './dto/range.dto';
import { ShowTickerInfoDto } from './dto/show.ticker.info.dto';
import { YahooFinanceService } from './yahoo-finance.service';

@ApiTags('yahoo-finance', 'tickers')
@UseInterceptors(CacheInterceptor)
@Controller('yahoo-finance')
export class YahooFinanceController {
  constructor(private yahooFinanceService: YahooFinanceService) {}

  @Get('tickers/info/:tickers')
  async getTickersInfo(
    @Param('tickers') tickers: string,
  ): Promise<Observable<ShowTickerInfoDto[]>> {
    try {
      return this.yahooFinanceService.getTickersListInfo(tickers);
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('tickers/:ticker/:date')
  getGap(@Param('ticker') ticker: string, @Param('date') date: number) {
    try {
      return this.yahooFinanceService.getGapByName(ticker, date);
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('tickers/price/:tickers/:range/:interval')
  @ApiParam({ name: 'range', enum: RangeDto })
  @ApiParam({ name: 'interval', enum: RangeDto })
  getTickersPrice(
    @Param('tickers') tickers: string,
    @Param('range') range: RangeDto,
    @Param('interval') interval: RangeDto,
  ) {
    try {
      return this.yahooFinanceService.getChart(tickers, range, interval);
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }
}
