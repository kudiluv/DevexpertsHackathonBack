import { HttpException } from '@nestjs/common';

export class HttpExceptionHandler {
  constructor(private error: any) {}

  throwIf(
    status: number,
    exception: HttpException | string,
  ): HttpExceptionHandler {
    if (this.error instanceof HttpException) {
      if (this.error.getStatus() === status) {
        this.generateException(status, exception);
      }
    }
    return this;
  }

  private generateException(status: number, exception: HttpException | string) {
    if (typeof exception === 'string') {
      throw new HttpException(exception, status);
    }
    if (exception instanceof HttpException) {
      throw exception;
    }
  }
}
