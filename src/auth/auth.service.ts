import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.model';
import { TokensDto } from './dto/tokens.dto';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { UserDto } from './dto/user.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRedis() private redis: Redis,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const passValid = await bcrypt.compare(pass, user.password);
      if (passValid) {
        return user;
      }
    }
    return null;
  }
  async login(user: User): Promise<TokensDto> {
    return this.generateKeys(user);
  }

  async register(userDto: CreateUserDto): Promise<TokensDto> {
    const user = await this.usersService.findOne(userDto.username);
    if (user) {
      throw new HttpException('User alredy exists', HttpStatus.CONFLICT);
    }
    const hashedPass = await bcrypt.hash(userDto.password, 5);
    const createdUser = await this.usersService.create({
      username: userDto.username,
      password: hashedPass,
    });
    return this.login(createdUser);
  }

  async refresh(tokens: TokensDto): Promise<TokensDto> {
    const user = this.verifyTokens(tokens);
    const deletedNumber = await this.redis.del(tokens.refresh_token);
    if (!deletedNumber) {
      throw new HttpException('Tokens are not valid', HttpStatus.UNAUTHORIZED);
    }
    return this.generateKeys(user);
  }

  private verifyTokens(tokens: TokensDto): UserDto {
    try {
      const userFromAccess = this.jwtService.verify<UserDto>(
        tokens.access_token,
        {
          ignoreExpiration: true,
        },
      );
      const userFromRefresh = this.jwtService.verify<UserDto>(
        tokens.refresh_token,
      );
      if (userFromAccess.id !== userFromRefresh.id) {
        throw new HttpException(
          'Tokens are not valid',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return userFromAccess;
    } catch (error) {
      throw new HttpException('Tokens are not valid', HttpStatus.UNAUTHORIZED);
    }
  }

  private async generateKeys(user: UserDto): Promise<TokensDto> {
    return {
      access_token: await this.generateAccessToken(user),
      refresh_token: await this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: UserDto) {
    const payload = { username: user.username, id: user.id };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(user: UserDto) {
    const payload = { username: user.username, id: user.id };
    const token = this.jwtService.sign(payload, { expiresIn: '30d' });
    this.redis.set(token, user.id);
    return token;
  }
}
