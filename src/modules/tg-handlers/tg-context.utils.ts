import { Context } from 'telegraf';

export const getTextFromCtx = (ctx: Context): string | null => {
  if (!ctx.message || !('text' in ctx.message)) {
    return null;
  }
  return ctx.message.text.trim();
};
