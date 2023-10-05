import { DividendPriceStatisticDto } from './dividend.prcie.statistic.dto';

export class DividendDto {
  date: Date;

  dividendPrice: number;

  gap: number;

  dividendPriceStatistic: DividendPriceStatisticDto;

  symbol: string;
}
