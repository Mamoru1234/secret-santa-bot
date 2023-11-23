import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { TgHandler } from '../tg-handlers.service';
import { Injectable, Logger } from '@nestjs/common';
import { runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSessionEntity } from '../../db/entities/chat-session.entity';
import { Repository } from 'typeorm';
import { ChatSessionFetcher } from '../../tg-session-data/chat-session.fetcher';

@Injectable()
export class RemindActionHandler implements TgHandler {
  private readonly logger = new Logger(RemindActionHandler.name);

  constructor(
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly bot: Telegraf,
    private readonly sessionFetcher: ChatSessionFetcher,
    @InjectRepository(ChatSessionEntity) private readonly sessionRepository: Repository<ChatSessionEntity>,
  ) {}

  configure(bot: Telegraf<Context<Update>>): void {
    bot.action(
      'remind',
      runWithGuard(this.sessionGuardFactory.withSession(), this.logger, (ctx) => this.handler(ctx)),
    );
  }

  async handler(ctx: Context): Promise<void> {
    const session = await this.sessionFetcher.require(ctx);
    const roomSessions = await this.sessionRepository.find({
      where: {
        gameRoomId: session.gameRoomId,
      },
      relations: {
        letter: true,
      },
    });
    const sessionsToRemind = roomSessions.filter((it) => !it.letter);
    await Promise.all(sessionsToRemind.map((it) => this.bot.telegram.sendMessage(it.chatId, 'Напиши листа, будь ласка🙏')));
    await ctx.sendMessage('Done');
  }
}
