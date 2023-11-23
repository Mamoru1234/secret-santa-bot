import { Context } from 'telegraf';

export const getTextFromEditedCtx = (ctx: Context): string | null => {
  if (!ctx.editedMessage || !('text' in ctx.editedMessage)) {
    return null;
  }
  return ctx.editedMessage.text.trim();
};

export const getTextFromCtx = (ctx: Context): string | null => {
  if (!ctx.message || !('text' in ctx.message)) {
    return null;
  }
  return ctx.message.text.trim();
};
