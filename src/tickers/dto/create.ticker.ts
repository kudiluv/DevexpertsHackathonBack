import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateTickerDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
