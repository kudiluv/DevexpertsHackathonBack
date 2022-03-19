import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticker } from './tickers.model';
import { TickersService } from './tickers.service';
import { TickersController } from './tickers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ticker])],
  providers: [TickersService],
  controllers: [TickersController],
})
export class TickersModule {}
