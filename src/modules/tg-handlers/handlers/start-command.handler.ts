import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { TgHandler } from '../tg-handlers.service';
import { Injectable, Logger } from '@nestjs/common';
import { asyncHandlerWrapper } from '../../telegraf/async-handler.wrapper';

@Injectable()
export class StartCommandHandler implements TgHandler {
  private readonly logger = new Logger(StartCommandHandler.name);
  configure(bot: Telegraf<Context<Update>>): void {
    bot.start(
      asyncHandlerWrapper(this.logger, async (ctx) => {
        await ctx.sendMessage('Йо-хо-хо чи знаєш ти пароль для своєї гри?');
      }),
    );
  }
}
