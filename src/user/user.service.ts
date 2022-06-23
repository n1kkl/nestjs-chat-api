import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../common/service/prisma.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthResponse } from './auth-response.type';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService
  ) {
  }

  public async createUser(userDto: CreateUserDto): Promise<User> {
    // check username availability
    if (!await this.checkAvailability('username', userDto.username)) {
      throw new HttpException('This username is already taken.', 400);
    }

    // check email availability
    if (!await this.checkAvailability('email', userDto.email)) {
      throw new HttpException('This email is already in use.', 400);
    }

    // create user
    return await this.prismaService.user.create({
      data: {
        username: userDto.username,
        email: userDto.email,
        password: await bcrypt.hash(userDto.password, 14),
        firstname: userDto.firstname,
        surname: userDto.surname
      }
    });
  }

  public async loginUser(loginDto: LoginUserDto): Promise<AuthResponse> {
    // check if secret is set
    if (!process.env.JWT_SECRET) {
      throw new HttpException('Internal server error.', 500);
    }

    // find user & validate password
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email }
    });
    if (!user || !await bcrypt.compare(loginDto.password, user.password)) {
      throw new HttpException('Invalid email or password.', 400);
    }

    // generate jwt token
    return {
      token: jwt.sign({
        id: user.authId
      }, process.env.JWT_SECRET, { expiresIn: '60d' })
    };
  }

  public async checkAvailability(field: keyof User, value: string): Promise<boolean> {
    return !await this.prismaService.user.findUnique({
      where: {
        [field]: value
      }
    });
  }
}
