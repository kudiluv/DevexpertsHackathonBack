import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ShowTickerInfoDto } from './dto/show.ticker.info.dto';
import { ShowTickerPrice } from './dto/show.ticker.price.dto';

@Injectable()
export class YahooFinanceService {
  constructor(private httpService: HttpService) {}

  // TODO: type to this function
  getActualPrices(
    tickers: string,
    range: string,
    interval: string,
  ): Observable<ShowTickerPrice[]> {
    return this.httpService
      .get(
        `https://yfapi.net/v8/finance/spark?interval=${interval}&range=${range}&symbols=${tickers}`,
        {
          headers: {
            'X-API-KEY': process.env.YAHOO_FINANCE_KEY,
          },
        },
      )
      .pipe(
        map((response) => {
          const data = response.data;
          const keys = Object.keys(data);

          return keys.map((el) => {
            const tickerPrice = new ShowTickerPrice();

            tickerPrice.symbol = el;
            tickerPrice.prices = data[el].close;

            return tickerPrice;
          });
        }),
      );
  }

  getTickersListInfo(tickers: string): Observable<ShowTickerInfoDto[]> {
    return this.httpService
      .get(
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
