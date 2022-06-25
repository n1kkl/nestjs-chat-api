import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CurrentUser } from './user.decorator';
import { Public } from '../auth/public.metadata';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthResponse } from '../auth/auth-response.type';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
  }

  @Post('register')
  @Public()
  async register(@Body() userDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(userDto);
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: User): Promise<AuthResponse> {
    return this.authService.login(user);
  }

  @Get('me')
  async current(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Patch('me')
  async update(@CurrentUser() user: User, @Body() userDto: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(user.id, userDto);
  }
}
