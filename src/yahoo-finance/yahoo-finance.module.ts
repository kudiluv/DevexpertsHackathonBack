import { Module } from '@nestjs/common';
import { YahooFinanceService } from './yahoo-finance.service';
import { YahooFinanceController } from './yahoo-finance.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
  ],
  providers: [YahooFinanceService],
  controllers: [YahooFinanceController],
})
export class YahooFinanceModule {}
