import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { TgHandler } from '../tg-handlers.service';
import { runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { Logger } from '@nestjs/common';
import { ChatSessionFetcher } from '../../tg-session-data/chat-session.fetcher';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSessionEntity } from '../../db/entities/chat-session.entity';
import { Repository } from 'typeorm';
import { createGamePairs } from '../game/game.utils';

export class PlayActionHandler implements TgHandler {
  private readonly logger = new Logger(PlayActionHandler.name);

  constructor(
    private readonly bot: Telegraf,
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly sessionFetcher: ChatSessionFetcher,
    @InjectRepository(ChatSessionEntity) private readonly sessionRepository: Repository<ChatSessionEntity>,
  ) {}

  configure(bot: Telegraf<Context<Update>>): void {
    bot.action(
      'play',
      runWithGuard(this.sessionGuardFactory.withSession(), this.logger, (ctx) => this.handle(ctx)),
    );
  }

  async handle(ctx: Context): Promise<void> {
    const session = await this.sessionFetcher.require(ctx);
    const roomSessions = await this.sessionRepository.find({
      where: {
        gameRoomId: session.gameRoomId,
      },
      relations: {
        letter: true,
      },
    });
    const pairs = createGamePairs(roomSessions.length);
    await ctx.sendMessage('Let game begin');
    for (let i = 0; i < pairs.length; i++) {
      const santaSession = roomSessions[i];
      const playerSession = roomSessions[pairs[i]];
      const message = `Your player ${playerSession.firstName} @${playerSession.userName}`;
      await this.bot.telegram.sendMessage(santaSession.chatId, message);
    }
  }
}
