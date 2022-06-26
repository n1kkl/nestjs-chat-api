import { HttpException, Injectable } from '@nestjs/common';
import { Channel, User } from '@prisma/client';
import { CreateChannelDto, UpdateChannelDto } from './channel.dto';
import { PrismaService } from '../common/service/prisma.service';

@Injectable()
export class ChannelService {
  constructor(
    private prismaService: PrismaService
  ) {
  }

  async createChannel(ownerId: string, channelDto: CreateChannelDto): Promise<Channel> {
    return await this.prismaService.channel.create({
      data: {
        title: channelDto.title,
        description: channelDto.description,
        ownerId
      }
    });
  }

  async updateChannel(channelId: string, channelDto: UpdateChannelDto): Promise<Channel> {
    return await this.prismaService.channel.update({
      where: {id: channelId},
      data: {
        title: channelDto.title,
        description: channelDto.description,
      }
    });
  }

  async findChannel(value: string, field: keyof Channel = 'id'): Promise<Channel> {
    const channel = await this.prismaService.channel.findFirst({
      where: {
        [field]: value
      }
    });
    if (!channel) {
      throw new HttpException('This channel does not exist.', 404);
    }
    return channel;
  }
}
