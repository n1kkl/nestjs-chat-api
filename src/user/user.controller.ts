import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { AuthResponse } from './auth-response.type';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
  ) {
  }

  @Post('register')
  async register(@Body() userDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(userDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto): Promise<AuthResponse> {
    return await this.userService.loginUser(loginDto);
  }
}
