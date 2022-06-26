import { forwardRef, Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaService } from '../common/service/prisma.service';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [forwardRef(() => MessageModule)],
  providers: [ChannelService, PrismaService],
  controllers: [ChannelController],
  exports: [ChannelService]
})
export class ChannelModule {}
