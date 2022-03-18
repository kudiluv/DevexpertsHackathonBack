import { Injectable } from '@nestjs/common';
import { ShowTickerInfoDto } from './dto/show.ticker.divedend.dto';

@Injectable()
export class YahooFinanceService {
  getTickersListInfo(): ShowTickerInfoDto[] {
    return [];
  }
}
