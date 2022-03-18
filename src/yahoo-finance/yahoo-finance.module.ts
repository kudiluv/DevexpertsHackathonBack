import { Module } from '@nestjs/common';
import { YahooFinanceService } from './yahoo-finance.service';
import { YahooFinanceController } from './yahoo-finance.controller';

@Module({
  providers: [YahooFinanceService],
  controllers: [YahooFinanceController],
})
export class YahooFinanceModule {}
