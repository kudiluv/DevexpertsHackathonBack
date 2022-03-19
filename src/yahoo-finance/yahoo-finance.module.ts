import {
  CacheInterceptor,
  CacheModule,
  CACHE_MANAGER,
  Module,
} from '@nestjs/common';
import { YahooFinanceService } from './yahoo-finance.service';
import { YahooFinanceController } from './yahoo-finance.controller';
import { HttpModule } from '@nestjs/axios';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register(),
    HttpModule.register({
      maxRedirects: 5,
    }),
  ],
  providers: [YahooFinanceService],
  controllers: [YahooFinanceController],
})
export class YahooFinanceModule {}
