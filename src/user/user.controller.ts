import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CurrentUser } from './user.decorator';
import { Public } from '../auth/public.metadata';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthResponse } from '../auth/auth-response.type';
import { AuthService } from '../auth/auth.service';
import { PrivateUser, PublicUser } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
  }

  @Post('register')
  @Public()
  async register(@Body() userDto: CreateUserDto): Promise<PrivateUser> {
    return new PrivateUser(await this.userService.createUser(userDto));
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: User): Promise<AuthResponse> {
    return this.authService.login(user);
  }

  @Get('me')
  async current(@CurrentUser() user: User): Promise<PrivateUser> {
    return new PrivateUser(user);
  }

  @Patch('me')
  async update(@CurrentUser() user: User, @Body() userDto: UpdateUserDto): Promise<PrivateUser> {
    return new PrivateUser(await this.userService.updateUser(user.id, userDto));
  }

  @Get(':userId')
  async find(@Param('userId') userId: string): Promise<PublicUser> {
    return new PublicUser(await this.userService.findUser(userId));
  }
}
