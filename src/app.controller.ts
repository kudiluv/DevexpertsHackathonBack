import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppDto } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  suka(@Body() appDto: AppDto): AppDto {
    return appDto;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
