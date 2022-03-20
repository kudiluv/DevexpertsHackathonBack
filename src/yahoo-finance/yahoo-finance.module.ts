import { CacheModule, Module } from '@nestjs/common';
import { YahooFinanceService } from './yahoo-finance.service';
import { YahooFinanceController } from './yahoo-finance.controller';
import { HttpModule } from '@nestjs/axios';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      ttl: 1000 * 60 * 12,
    }),
    HttpModule.register({
      maxRedirects: 5,
    }),
  ],
  providers: [YahooFinanceService],
  controllers: [YahooFinanceController],
})
export class YahooFinanceModule {}
