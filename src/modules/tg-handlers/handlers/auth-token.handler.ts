import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { TgHandler } from '../tg-handlers.service';
import { runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { Logger } from '@nestjs/common';
import { getTextFromCtx } from '../tg-context.utils';
import { Repository } from 'typeorm';
import { GameRoomEntity } from '../../db/entities/game-room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSessionEntity, Role } from '../../db/entities/chat-session.entity';
import { isUUID } from 'class-validator';
import { ActiveStepEntity } from '../../db/entities/active-step.entity';
import { WriteLetterHandler } from './write-letter.handler';

interface AuthTokenOutput {
  room: GameRoomEntity;
  role: Role;
}

export class AuthTokenHandler implements TgHandler {
  private readonly logger = new Logger(AuthTokenHandler.name);

  constructor(
    private readonly sessionGuardFactory: SessionGuardFactory,
    @InjectRepository(GameRoomEntity) private readonly gameRoomRepository: Repository<GameRoomEntity>,
    @InjectRepository(ChatSessionEntity) private readonly sessionRepository: Repository<ChatSessionEntity>,
    @InjectRepository(ActiveStepEntity) private readonly activeStepRepository: Repository<ActiveStepEntity>,
  ) {}

  configure(bot: Telegraf<Context<Update>>): void {
    bot.use(runWithGuard(this.sessionGuardFactory.noSession(), this.logger, (ctx) => this.handle(ctx)));
  }

  async handle(ctx: Context): Promise<void> {
    if (!ctx.chat) {
      throw new Error('No chat in ctx');
    }
    if (ctx.chat.type !== 'private') {
      await ctx.sendMessage('Sorry I do not support not private conversation');
      return;
    }
    const token = getTextFromCtx(ctx);
    if (token === null) {
      await ctx.sendMessage('👀 Надішли будь-ласка секрет 🕵️‍♂️');
      return;
    }
    const tokenAuth = await this.authToken(token);
    if (!tokenAuth) {
      await ctx.sendMessage('Схоже що ти не дуже знаєш секрет компанії в якій граєш)');
      return;
    }
    if (!ctx.chat.first_name || !ctx.chat.username || !ctx.chat.id) {
      await ctx.sendMessage('Схоже я не можу дістати потрібну інформацію про тебе, зв`яжись з розробником)');
      this.logger.error('Missing chat info', {
        chat: ctx.chat,
      });
      return;
    }
    const session = await this.sessionRepository.save({
      gameRoom: tokenAuth.room,
      role: tokenAuth.role,
      chatId: `${ctx.chat.id}`,
      firstName: `${ctx.chat.first_name}`,
      userName: `${ctx.chat.username}`,
    });
    await ctx.sendMessage('Please write a letter');
    await this.activeStepRepository.save({
      session,
      type: WriteLetterHandler.WRITING_LETTER_STEP,
      data: {
        parts: [],
      },
    });
  }

  private async authToken(token: string): Promise<AuthTokenOutput | null> {
    if (!isUUID(token, '4')) {
      return null;
    }
    const adminRoom = await this.gameRoomRepository.findOne({
      where: {
        adminToken: token,
      },
    });
    if (adminRoom) {
      return {
        role: Role.ADMIN,
        room: adminRoom,
      };
    }
    const userRoom = await this.gameRoomRepository.findOne({
      where: {
        userToken: token,
      },
    });
    if (userRoom) {
      return {
        role: Role.USER,
        room: userRoom,
      };
    }
    return null;
  }
}
