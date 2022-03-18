import { IsString } from 'class-validator';

export default class GoogleTokenDto {
  @IsString()
  token: string;
}
