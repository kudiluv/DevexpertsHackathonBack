import { Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ShowTickerInfoDto } from './dto/show.ticker.divedend.dto';
import { YahooFinanceService } from './yahoo-finance.service';

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

  @Get('tickers/price/:tickers/:period/:interval')
  getTickersPrice(
    @Param('tickers') tickers: string,
    @Param('tickers') period: string,
    @Param('tickers') interval: string,
  ): Observable<any> {
    return this.yahooFinanceService.getActualPrices(tickers, period, interval);
  }
}
