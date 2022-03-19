import {
  CacheInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';

@Controller()
export class AppController {
  @Get('ping')
  getHello(): string {
    return 'pong';
  }
}
