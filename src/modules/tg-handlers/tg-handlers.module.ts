import { Module } from '@nestjs/common';
import { TgHandlersService } from './tg-handlers.service';
import { APP_HANDLERS } from './handlers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRoomEntity } from '../db/entities/game-room.entity';
import { TgGuardsModule } from '../tg-guards/tg-guards.module';
import { TgSessionDataModule } from '../tg-session-data/tg-session-data.module';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';
import { ActiveStepEntity } from '../db/entities/active-step.entity';
import { ActiveStepDataService } from './active-step-data.service';
import { PlayerSantaLetterEntity } from '../db/entities/player-santa-letter.entity';
import { TelegrafModule } from '../telegraf/telegraf.module';

@Module({
  imports: [
    TelegrafModule,
    TypeOrmModule.forFeature([GameRoomEntity, ChatSessionEntity, ActiveStepEntity, PlayerSantaLetterEntity]),
    TgGuardsModule,
    TgSessionDataModule,
  ],
  providers: [TgHandlersService, ActiveStepDataService, ...APP_HANDLERS],
  exports: [TgHandlersService],
})
export class TgHandlersModule {}
