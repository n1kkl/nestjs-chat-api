import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from '../common/service/prisma.service';
import { CreateMessageDto } from './message.dto';
import { ChannelService } from '../channel/channel.service';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MessageService {
  constructor(
    private prismaService: PrismaService,
    private channelService: ChannelService,
    private eventEmitter: EventEmitter2
  ) {
  }

  async findMessages(channelId: string, page: number, pageSize: number): Promise<Message[]> {
    pageSize = Math.min(100, pageSize);
    await this.channelService.findChannel(channelId);
    return await this.prismaService.message.findMany({
      where: {channelId},
      skip: pageSize * page,
      take: pageSize
    });
  }

  async createMessage(authorId: string, channelId: string, messageDto: CreateMessageDto): Promise<Message> {
    await this.channelService.findChannel(channelId);
    const message = await this.prismaService.message.create({
      data: {
        content: messageDto.content,
        channelId: channelId,
        authorId: authorId
      }
    });
    this.eventEmitter.emit('message.created', message);
    return message;
  }

  async listenMessage(channelId: string): Promise<Observable<Message>> {
    await this.channelService.findChannel(channelId);
    return new Observable<Message>((observer) => {
      // send message event
      this.eventEmitter.on('message.created', (message: Message) => {
        if (message.channelId === channelId) {
          observer.next(message);
        }
      });
    });
  }
}
