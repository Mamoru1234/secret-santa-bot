import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { TgHandler } from '../tg-handlers.service';
import { Injectable, Logger } from '@nestjs/common';
import { asyncHandlerWrapper } from '../../telegraf/async-handler.wrapper';
import { ChatSessionFetcher } from '../../tg-session-data/chat-session.fetcher';
import { Repository } from 'typeorm';
import { ChatSessionEntity } from '../../db/entities/chat-session.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StartCommandHandler implements TgHandler {
  private readonly logger = new Logger(StartCommandHandler.name);
  constructor(
    @InjectRepository(ChatSessionEntity) private readonly sessionRepository: Repository<ChatSessionEntity>,
    private readonly chatSessionFetcher: ChatSessionFetcher,
  ) {}
  configure(bot: Telegraf<Context<Update>>): void {
    bot.start(
      asyncHandlerWrapper(this.logger, async (ctx) => {
        const session = await this.chatSessionFetcher.get(ctx);
        if (session) {
          this.logger.log('Cleanning-up existing session');
          await this.sessionRepository.remove(session);
        }
        await ctx.sendMessage('Йо-хо-хо чи знаєш ти секрет для своєї гри?');
      }),
    );
  }
}
