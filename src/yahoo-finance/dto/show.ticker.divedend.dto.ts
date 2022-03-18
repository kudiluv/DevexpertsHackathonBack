import { Transform } from 'class-transformer';
import moment from 'moment';

export class ShowTickerInfoDto {
  shortName: string;

  longName: string;

  symbol: string;

  @Transform(({ value }) => value.regularMarketPrice)
  currentPrice: number;

  @Transform(({ value }) => moment(value.dividendDate))
  dividendDate: Date;

  @Transform(({ value }) => value.fiftyTwoWeekRange)
  pricePerTwoWeeks: string;
}
