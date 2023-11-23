import { TgHandler } from '../tg-handlers.service';
import { Telegraf, Context, Markup } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { ActiveStepGuardFactory } from '../../tg-guards/active-step-guard.factory';
import { combine, runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { Injectable, Logger } from '@nestjs/common';
import { getTextFromCtx } from '../tg-context.utils';
import { ActiveStepDataService } from '../active-step-data.service';
import { Repository } from 'typeorm';
import { PlayerSantaLetterEntity } from '../../db/entities/player-santa-letter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSessionFetcher } from '../../tg-session-data/chat-session.fetcher';

interface WritingLetterData {
  parts: string[];
}

interface ConfirmLetterData {
  letter: string;
}

function letterConfirKeyboard() {
  return Markup.keyboard([['Все вірно', 'Давай заново']])
    .oneTime()
    .resize();
}

@Injectable()
export class WriteLetterHandler implements TgHandler {
  static WRITING_LETTER_STEP = 'WRITING_LETTER_STEP';
  static CONFIRM_LETTER_STEP = 'CONFIRM_LETTER_STEP';

  private readonly logger = new Logger(WriteLetterHandler.name);

  constructor(
    private readonly activeStepGuardFactory: ActiveStepGuardFactory,
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly activeStepDataService: ActiveStepDataService,
    private readonly chatSessionFetcher: ChatSessionFetcher,
    @InjectRepository(PlayerSantaLetterEntity) private readonly playerSantaLetterRepo: Repository<PlayerSantaLetterEntity>,
  ) {}

  configure(bot: Telegraf<Context<Update>>): void {
    bot.use(
      runWithGuard(
        combine(
          this.sessionGuardFactory.withSession(),
          this.activeStepGuardFactory.byType(WriteLetterHandler.WRITING_LETTER_STEP),
        ),
        this.logger,
        (ctx) => this.handleWritingLetter(ctx),
      ),
    );
    bot.use(
      runWithGuard(
        combine(
          this.sessionGuardFactory.withSession(),
          this.activeStepGuardFactory.byType(WriteLetterHandler.CONFIRM_LETTER_STEP),
        ),
        this.logger,
        (ctx) => this.handleLetterConfimation(ctx),
      ),
    );
  }

  async handleWritingLetter(ctx: Context): Promise<void> {
    const text = getTextFromCtx(ctx);
    if (!text) {
      await ctx.sendMessage('Треба надіслати текст');
      return;
    }
    const { parts = [] } = await this.activeStepDataService.getData<WritingLetterData>(ctx);
    if (text === 'Кінець листа') {
      if (!parts.length) {
        await ctx.sendMessage('Ееее ні треба написати хоч щось.');
        return;
      }
      const letter = parts.join('\n');
      await ctx.sendMessage('Фінальний варіант листа:');
      await this.activeStepDataService.updateStepData(ctx, WriteLetterHandler.CONFIRM_LETTER_STEP, {
        letter,
      });
      await ctx.sendMessage(letter, letterConfirKeyboard());
      return;
    }
    const newParts = parts.concat([text]);
    await this.activeStepDataService.updateStepData(ctx, WriteLetterHandler.WRITING_LETTER_STEP, {
      parts: newParts,
    });
    await ctx.sendMessage('Ok you are writing letter');
    await ctx.sendMessage(newParts.join('\n'));
  }

  async handleLetterConfimation(ctx: Context): Promise<void> {
    const text = getTextFromCtx(ctx);
    if (!text) {
      await ctx.sendMessage('Треба надіслати текст');
      return;
    }
    if (text === 'Давай заново') {
      await this.activeStepDataService.updateStepData(ctx, WriteLetterHandler.WRITING_LETTER_STEP, {
        parts: [],
      });
      await ctx.sendMessage('Ну що ж давай спробуємо написати лист з нуля');
      return;
    }
    if (text !== 'Все вірно') {
      await ctx.sendMessage('Щось не зрозуміле ти таке написав', letterConfirKeyboard());
    }
    const { letter } = await this.activeStepDataService.getData<ConfirmLetterData>(ctx);
    const session = await this.chatSessionFetcher.require(ctx);
    this.logger.log('Saving letter', {
      letter,
      session,
    });
    await this.playerSantaLetterRepo.save({
      session,
      letter,
    });
    await ctx.sendMessage('Letter is saved wait for play');
  }
}
