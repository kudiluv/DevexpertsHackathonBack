import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RangeDto } from './dto/range.dto';
import { ShowTickerInfoDto } from './dto/show.ticker.info.dto';
import { ShowTickerPriceDto } from './dto/show.ticker.price.dto';
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
    return this.yahooFinanceService.getTickersListInfo(tickers);
  }

  @Get('tikcers/test')
  test() {
    return this.yahooFinanceService.getDivedends('AAPL,MSTF,JPM');
  }

  @ApiParam({ name: 'range', enum: RangeDto })
  @ApiParam({ name: 'interval', enum: RangeDto })
  @Get('tickers/price/:tickers/:range/:interval')
  getTickersPrice(
    @Param('tickers') tickers: string,
    @Param('range') range: RangeDto,
    @Param('interval') interval: RangeDto,
  ): Observable<ShowTickerPriceDto[]> {
    console.log('not cached');
    return this.yahooFinanceService.getActualPrices(tickers, range, interval);
  }
}
