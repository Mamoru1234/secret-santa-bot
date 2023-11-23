import { TgHandler } from '../tg-handlers.service';
import { Telegraf, Context, Markup } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { ActiveStepGuardFactory } from '../../tg-guards/active-step-guard.factory';
import { combine, runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { Injectable, Logger } from '@nestjs/common';
import { getTextFromCtx, getTextFromEditedCtx } from '../tg-context.utils';
import { ActiveStepDataService } from '../active-step-data.service';
import { Repository } from 'typeorm';
import { PlayerSantaLetterEntity } from '../../db/entities/player-santa-letter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSessionFetcher } from '../../tg-session-data/chat-session.fetcher';

interface WritingLetterData {
  letter?: string;
}

const SEND_LETTER = 'Відправити Санті ✉️';
const LETTER_SENT_MESSAGE = `Твій лист в дорозі.💫 Тепер чекаємо на розіграш листів між учасниками.
Щоб подивитись статус учасників - надішли команду /members.`;

function letterConfirKeyboard() {
  return Markup.keyboard([[SEND_LETTER]])
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
  }

  async handleWritingLetter(ctx: Context): Promise<void> {
    const editedText = getTextFromEditedCtx(ctx);
    if (editedText === SEND_LETTER) {
      await ctx.sendMessage('Ой вей на таке не варто редагувати повідомлення.');
      return;
    }
    if (editedText) {
      await this.activeStepDataService.updateStepData(ctx, WriteLetterHandler.WRITING_LETTER_STEP, {
        letter: editedText,
      });
      return;
    }
    const text = getTextFromCtx(ctx);
    if (text === SEND_LETTER) {
      const { letter } = await this.activeStepDataService.getData<WritingLetterData>(ctx);
      if (!letter) {
        await ctx.sendMessage('Я не маю що відправити');
        return;
      }
      await ctx.sendMessage(LETTER_SENT_MESSAGE);
      const session = await this.chatSessionFetcher.require(ctx);
      await this.playerSantaLetterRepo.save({
        session,
        letter,
      });
      await this.activeStepDataService.updateStepData(ctx, 'INIT', {});
      return;
    }
    if (!text) {
      await ctx.sendMessage('Треба надіслати текст');
      return;
    }
    await this.activeStepDataService.updateStepData(ctx, WriteLetterHandler.WRITING_LETTER_STEP, {
      letter: text,
    });
    await ctx.sendMessage('Дякую, я отримав листа. Натисни "відправити", якщо впевнений в тексті.', letterConfirKeyboard());
  }
}
