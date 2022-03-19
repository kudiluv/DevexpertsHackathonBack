import { Injectable } from '@nestjs/common';
import * as generator from 'generate-password';

@Injectable()
export default class PasswordGenerator {
  generatePassword(): string {
    return generator.generate({
      length: 10,
      numbers: true,
    });
  }
}
