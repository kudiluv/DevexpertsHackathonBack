import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { firstValueFrom, lastValueFrom, map, Observable } from 'rxjs';
import ChartDto from './dto/chart.dto';
import { DividendDto } from './dto/dividend.dto';
import { DividendPriceStatisticDto } from './dto/dividend.prcie.statistic.dto';
import GapDto from './dto/gap.dto';
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

  getChart(
    ticker: string,
    interval: string,
    range: string,
  ): Observable<ChartDto> {
    return this.httpService
      .get(
        `https://yfapi.net/v8/finance/chart/${ticker}?interval=${interval}&range=${range}`,
        {
          headers: {
            'X-API-KEY': process.env.YAHOO_FINANCE_KEY,
          },
        },
      )
      .pipe(
        map((response) => {
          const data = response.data.chart.result[0];

          const chartDto = new ChartDto();
          chartDto.timestamp = data.timestamp;
          chartDto.close = data.indicators.quote[0].close;
          chartDto.open = data.indicators.quote[0].open;
          chartDto.symbol = data.meta.symbol;

          return chartDto;
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
    const tikcersArr = tickers.split(',');
    const prices: ShowTickerPriceDto[] = await lastValueFrom(
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

    const charts = await Promise.all(
      tikcersArr.map(
        async (el) =>
          await firstValueFrom(this.getChart(el, RangeDto.d1, RangeDto.y1)),
      ),
    );
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
            ticker.dividends[0].gap = this.getGap(
              charts.find((item) => item.symbol === el.symbol),
              new Date(ticker.dividends[0].date).getTime() / 1000,
            );

            ticker.dividends[0].dividendPriceStatistic = this.getDateOfBack(
              charts.find((item) => item.symbol === el.symbol),
              new Date(ticker.dividends[0].date).getTime() / 1000,
            );

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

  async getGapByName(ticker: string, date: number): Promise<GapDto> {
    const chart = await firstValueFrom(
      this.getChart(ticker, RangeDto.d1, RangeDto.y1),
    );
    return {
      value: await this.getGap(chart, date),
    };
  }

  private getGap(chartDto: ChartDto, keyDate: number) {
    const paymentDate = chartDto.timestamp.findIndex((item) => {
      return moment(keyDate * 1000)
        .startOf('day')
        .isSame(moment(item * 1000).startOf('day'));
    });

    const closeDate = chartDto.close[paymentDate - 2];
    const openDate = chartDto.open[paymentDate - 1];
    const gap = (openDate - closeDate) / closeDate;
    return gap;
  }

  private getDateOfBack(chart: ChartDto, date: number) {
    const paymentDate =
      chart.timestamp.findIndex((item) => {
        return moment(date * 1000)
          .startOf('day')
          .isSame(moment(item * 1000).startOf('day'));
      }) - 2;

    const dividendStatisticDto = new DividendPriceStatisticDto();

    for (let i = paymentDate + 1; i < chart.close.length; i++) {
      if (chart.close[i] >= chart.close[paymentDate]) {
        dividendStatisticDto.prices = chart.close.slice(paymentDate + 1, i + 1);
        dividendStatisticDto.timestamp = chart.timestamp.slice(
          paymentDate + 1,
          i + 1,
        );

        return dividendStatisticDto;
      } else if (chart.open[i] >= chart.close[paymentDate]) {
        dividendStatisticDto.prices = chart.open.slice(paymentDate + 1, i + 1);
        dividendStatisticDto.timestamp = chart.timestamp.slice(
          paymentDate + 1,
          i + 1,
        );

        return dividendStatisticDto;
      }
    }

    dividendStatisticDto.prices = chart.close.slice(paymentDate);
    dividendStatisticDto.timestamp = chart.close.slice(paymentDate);
  }
}
