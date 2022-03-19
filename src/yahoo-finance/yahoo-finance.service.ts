import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { RangeDto } from './dto/range.dto';
import { ShowTickerInfoDto } from './dto/show.ticker.info.dto';
import { ShowTickerPriceDto } from './dto/show.ticker.price.dto';

@Injectable()
export class YahooFinanceService {
  constructor(private httpService: HttpService) {}

  getActualPrices(
    tickers: string,
    range: string,
    interval: string,
  ): Observable<ShowTickerPriceDto[]> {
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
            const tickerPrice = new ShowTickerPriceDto();

            tickerPrice.symbol = el;
            tickerPrice.prices = data[el].close;
            tickerPrice.date = data[el].timestamp;

            return tickerPrice;
          });
        }),
      );
  }

  async getTickersListInfo(
    tickers: string,
  ): Promise<Observable<ShowTickerInfoDto[]>> {
    const prices: ShowTickerPriceDto[] = await firstValueFrom(
      this.getActualPrices(tickers, RangeDto.d1, RangeDto.d1),
    );

    console.log(prices);

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

            const priceIndex = prices.findIndex(
              (el: ShowTickerPriceDto) => el.symbol === ticker.symbol,
            );
            const price = prices[priceIndex];

            ticker.currentPrice = price.prices[price.prices.length - 1];

            return ticker;
          }),
        ),
      );
  }
}
