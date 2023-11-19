import { Context } from 'telegraf';
import { Logger } from '@nestjs/common';

export type NextFunction = () => Promise<void>;

export type BotHandler = (ctx: Context, next: NextFunction) => Promise<unknown>;

export const asyncHandlerWrapper = (logger: Logger, handler: BotHandler) => (ctx: Context, next: NextFunction) =>
  handler(ctx, next).catch((e) => {
    logger.warn('error during handler execution', { error: e });
    ctx.sendMessage('Сталася прикра помилка ;(');
  });
