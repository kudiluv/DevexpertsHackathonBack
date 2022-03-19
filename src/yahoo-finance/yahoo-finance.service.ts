import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ShowTickerInfoDto } from './dto/show.ticker.divedend.dto';

@Injectable()
export class YahooFinanceService {
  constructor(private httpService: HttpService) {}

  // TODO: type to this function
  getActualPrices(tickers: string, range: number, interval: number): any {
    const tickersArr = tickers.split(',');
    const prices = [];

    return this.httpService
      .get(
        `https://yfapi.net/v8/finance/spark?interval=${interval}&range=2y&symbols=${tickers}`,
        {
          headers: {
            'X-API-KEY': process.env.YAHOO_FINANCE_KEY,
          },
        },
      )
      .pipe(map((response) => response.data.quoteResponse.result));
  }

  getTickersListInfo(tickers: string): Observable<ShowTickerInfoDto[]> {
    return this.httpService
      .get<ShowTickerInfoDto[]>(
        `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${tickers}`,
        {
          headers: {
            'X-API-KEY': process.env.YAHOO_FINANCE_KEY,
          },
        },
      )
      .pipe(
        map((response) =>
          response.data.quoteResponse.result.map((el) => {
            const ticker = new ShowTickerInfoDto();

            ticker.shortName = el.shortName;
            ticker.longName = el.longName;
            ticker.symbol = el.symbol;
            ticker.currentPrice = 12;

            return ticker;
          }),
        ),
      );
  }
}
