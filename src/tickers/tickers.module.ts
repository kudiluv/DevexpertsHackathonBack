import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticker } from './tickers.model';
import { TickersService } from './tickers.service';
import { TickersController } from './tickers.controller';
import { TickersSeederService } from './tickers.seeder.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticker]), UsersModule],
  providers: [TickersService, TickersSeederService],
  controllers: [TickersController],
})
export class TickersModule {}
