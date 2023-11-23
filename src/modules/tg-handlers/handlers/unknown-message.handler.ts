import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { TgHandler } from '../tg-handlers.service';
import { asyncHandlerWrapper } from '../../telegraf/async-handler.wrapper';
import { Logger } from '@nestjs/common';
// Твій лист вже подорозі до Санти
export class UnknownMessageHandler implements TgHandler {
  private readonly logger = new Logger(UnknownMessageHandler.name);
  configure(bot: Telegraf<Context<Update>>): void {
    bot.use(
      asyncHandlerWrapper(this.logger, async (ctx) => {
        this.logger.log('received unknown message', {
          id: ctx.update.update_id,
        });
        await ctx.sendMessage('Вибач, я тебе не розумію 😬');
      }),
    );
  }
}
