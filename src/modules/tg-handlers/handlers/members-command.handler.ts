import { Injectable, Logger } from '@nestjs/common';
import { TgHandler } from '../tg-handlers.service';
import { Telegraf, Context, Markup } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { ActiveStepFetcher } from '../../tg-session-data/active-step.fetcher';
import { ChatSessionFetcher } from '../../tg-session-data/chat-session.fetcher';
import { Repository } from 'typeorm';
import { ChatSessionEntity, Role } from '../../db/entities/chat-session.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MembersCommandHandler implements TgHandler {
  private readonly logger = new Logger(MembersCommandHandler.name);

  constructor(
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly activeStepFetcher: ActiveStepFetcher,
    private readonly sessionFetcher: ChatSessionFetcher,
    @InjectRepository(ChatSessionEntity) private readonly sessionRepository: Repository<ChatSessionEntity>,
  ) {}

  configure(bot: Telegraf<Context<Update>>): void {
    bot.command(
      'members',
      runWithGuard(this.sessionGuardFactory.withSession(), this.logger, (ctx) => this.handle(ctx)),
    );
  }

  async handle(ctx: Context) {
    const activeStep = await this.activeStepFetcher.get(ctx);
    if (activeStep?.type !== 'INIT') {
      await ctx.sendMessage('На жаль, цю команду неможливо зараз виконати.');
      return;
    }
    const session = await this.sessionFetcher.require(ctx);
    const roomSessions = await this.sessionRepository.find({
      where: {
        gameRoomId: session.gameRoomId,
      },
      relations: {
        letter: true,
      },
    });
    const players = roomSessions
      .map((it) => `@${it.userName} ${it.letter ? 'лист написано ✅' : 'ще пише листа 📝'}`)
      .join('\n');
    await ctx.sendMessage('Зараз зареєстровані наступні гравці:');
    const allPlayerHasLetter = roomSessions.every((it) => Boolean(it.letter));
    const extra = session.role === Role.ADMIN ? this.buildAdminKeyboard(allPlayerHasLetter) : undefined;
    await ctx.sendMessage(players, extra);
  }

  private buildAdminKeyboard(allPlayerHasLetter: boolean) {
    const action = allPlayerHasLetter
      ? Markup.button.callback('Розіграти', 'play')
      : Markup.button.callback('Нагадати', 'remind');
    return Markup.inlineKeyboard([action]);
  }
}
