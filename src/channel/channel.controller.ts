import { Body, Controller, Get, Param, Patch, Post, Query, Sse } from '@nestjs/common';
import { CreateChannelDto, UpdateChannelDto } from './channel.dto';
import { Channel, Message, User } from '@prisma/client';
import { ChannelService } from './channel.service';
import { CurrentUser } from '../user/user.decorator';
import { CreateMessageDto } from '../message/message.dto';
import { MessageService } from '../message/message.service';
import { interval, map, merge, Observable } from 'rxjs';
import { ServerSentEvent } from '../common/type/server-sent-event.type';

@Controller('channel')
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private messageService: MessageService
  ) {
  }

  @Post()
  async create(@CurrentUser() user: User, @Body() channelDto: CreateChannelDto): Promise<Channel> {
    return await this.channelService.createChannel(user.id, channelDto);
  }

  @Patch(':channelId')
  async update(@Param() channelId: string, @Body() channelDto: UpdateChannelDto): Promise<Channel> {
    return await this.channelService.updateChannel(channelId, channelDto);
  }

  @Get(':channelId')
  async find(@Param('channelId') channelId: string): Promise<Channel> {
    return await this.channelService.findChannel(channelId);
  }

  @Post(':channelId/messages')
  async createMessage(@CurrentUser() user: User, @Param('channelId') channelId: string, @Body() messageDto: CreateMessageDto): Promise<Message> {
    return await this.messageService.createMessage(user.id, channelId, messageDto);
  }

  @Get(':channelId/messages')
  async findMessages(@Param('channelId') channelId: string, @Query('page') page?: string): Promise<Message[]> {
    return await this.messageService.findMessages(channelId, page && !isNaN(Number(page)) ? parseInt(page) : 0, 50);
  }

  @Sse(':channelId/events/messages')
  async listenMessages(@Param('channelId') channelId: string): Promise<Observable<ServerSentEvent<Message | string>>> {
    return merge(
      (await this.messageService.listenMessage(channelId)).pipe(map(message => ({
        data: message,
        type: 'message.created'
      }))),
      interval(10000).pipe(map((_) => ({ data: 'ok', type: 'heartbeat' })))
    );
  }
}
