import { Expose, Transform } from 'class-transformer';
import moment from 'moment';

@Expose()
export class ShowTickerInfoDto {
  shortName: string;

  longName: string;

  symbol: string;

  @Expose({ name: 'regularMarketPrice' })
  currentPrice: number;

  @Expose({ name: 'dividendDate' })
  @Transform(({ value }) => moment(value))
  dividendDate: Date;

  @Expose({ name: 'fiftyTwoWeekRange' })
  pricePerTwoWeeks: string;
}
