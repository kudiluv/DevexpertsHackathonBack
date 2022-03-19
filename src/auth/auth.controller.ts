import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { AuthService } from './auth.service';
import AuthServiceGoogle from './auth.service.google';
import GoogleTokenDto from './dto/google.token.dto';
import { TokensDto } from './dto/tokens.dto';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authServiceGoogle: AuthServiceGoogle,
  ) {}

  @ApiBody({ type: CreateUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<TokensDto> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<TokensDto> {
    return this.authService.register(user);
  }

  @Post('refresh')
  async refresh(@Body() tokens: TokensDto) {
    return this.authService.refresh(tokens);
  }

  @Post('google/login')
  async loginWithGoogle(@Body() token: GoogleTokenDto) {
    return this.authServiceGoogle.auth(token);
  }
}
