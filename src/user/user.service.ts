import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../common/service/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

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

  public async updateUser(id: string, userDto: UpdateUserDto): Promise<User> {
    const user = await this.prismaService.user.update({
      where: { id },
      data: {
        firstname: userDto.firstname,
        surname: userDto.surname
      }
    });
    if (!user) {
      throw new HttpException('This user does not exist.', 404);
    }
    return user;
  }

  public async findUser(value: string, field: keyof User = 'id'): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        [field]: value
      }
    });
    if (!user) {
      throw new HttpException('This user does not exist.', 404);
    }
    return user;
  }

  public async checkAvailability(field: keyof User, value: string): Promise<boolean> {
    return !await this.prismaService.user.findUnique({
      where: {
        [field]: value
      }
    });
  }
}
