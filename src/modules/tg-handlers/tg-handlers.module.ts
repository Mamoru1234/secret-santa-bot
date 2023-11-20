import { Module } from '@nestjs/common';
import { TgHandlersService } from './tg-handlers.service';
import { APP_HANDLERS } from './handlers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRoomEntity } from '../db/entities/game-room.entity';
import { TgGuardsModule } from '../tg-guards/tg-guards.module';
import { TgSessionDataModule } from '../tg-session-data/tg-session-data.module';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameRoomEntity, ChatSessionEntity]), TgGuardsModule, TgSessionDataModule],
  providers: [TgHandlersService, ...APP_HANDLERS],
  exports: [TgHandlersService],
})
export class TgHandlersModule {}
