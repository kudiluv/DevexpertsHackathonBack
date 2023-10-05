import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import AuthServiceGoogle from './auth.service.google';
import PasswordGenerator from './password.generator';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: 60 * 60,
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AuthServiceGoogle,
    PasswordGenerator,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
