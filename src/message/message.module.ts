import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaService } from '../common/service/prisma.service';
import { ChannelModule } from '../channel/channel.module';

@Module({
  imports: [forwardRef(() => ChannelModule)],
  providers: [MessageService, PrismaService],
  exports: [MessageService]
})
export class MessageModule {}
