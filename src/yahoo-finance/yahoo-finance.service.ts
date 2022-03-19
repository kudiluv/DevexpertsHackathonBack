import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import e from 'express';
import { firstValueFrom, lastValueFrom, map, Observable } from 'rxjs';
import { DividendDto } from './dto/dividend.dto';
import { RangeDto } from './dto/range.dto';
import { ShowTickerInfoDto } from './dto/show.ticker.info.dto';
import { ShowTickerPriceDto } from './dto/show.ticker.price.dto';

@Injectable()
export class YahooFinanceService {
  constructor(private httpService: HttpService) {}

  getDivedends(tickers: string): Observable<DividendDto[]> {
    return this.httpService
      .get(
        `http://api.marketstack.com/v1/dividends?access_key=${process.env.MARKETSTACK_KEY}&symbols=${tickers}&limit=100`,
      )
      .pipe(
        map((response) => {
          const data = response.data.data;

          data.sort((a, b) => {
            if (a.symbol > b.symbol) {
              return 1;
            }
            if (a.symbol < b.symbol) {
              return -1;
            }
            return 0;
          });

          return data.map((el) => {
            const dividend = new DividendDto();
            dividend.date = el.date;
            dividend.dividendPrice = el.dividend;
            dividend.symbol = el.symbol;

            return dividend;
          });
        }),
      );
  }

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

    const nonSortedDividends = await lastValueFrom(this.getDivedends(tickers));

    const groupByKey = (list, key) =>
      list.reduce(
        (hash, obj) => ({
          ...hash,
          [obj[key]]: (hash[obj[key]] || []).concat(obj),
        }),
        {},
      );
    const dividends = groupByKey(nonSortedDividends, 'symbol');

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
            ticker.dividends = dividends[el.symbol];

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
