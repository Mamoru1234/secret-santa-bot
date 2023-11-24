import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { TgHandler } from '../tg-handlers.service';
import { runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { Logger } from '@nestjs/common';
import { ChatSessionFetcher } from '../../tg-session-data/chat-session.fetcher';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSessionEntity } from '../../db/entities/chat-session.entity';
import { Repository } from 'typeorm';
import { createGameWithoutPairs } from '../game/game.utils';
import { PlayerPairEntity } from '../../db/entities/player-pair.entity';

export class PlayActionHandler implements TgHandler {
  private readonly logger = new Logger(PlayActionHandler.name);

  constructor(
    private readonly bot: Telegraf,
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly sessionFetcher: ChatSessionFetcher,
    @InjectRepository(ChatSessionEntity) private readonly sessionRepository: Repository<ChatSessionEntity>,
    @InjectRepository(PlayerPairEntity) private readonly playerPairRepository: Repository<PlayerPairEntity>,
  ) {}

  configure(bot: Telegraf<Context<Update>>): void {
    bot.action(
      'play',
      runWithGuard(this.sessionGuardFactory.withSession(), this.logger, (ctx) => this.handle(ctx)),
    );
  }

  async handle(ctx: Context): Promise<void> {
    const session = await this.sessionFetcher.require(ctx);
    const roomSessions = await this.sessionRepository.find({
      where: {
        gameRoomId: session.gameRoomId,
      },
      relations: {
        letter: true,
      },
    });
    const pairs = await this.buildPairsRestriction(roomSessions);
    const game = createGameWithoutPairs(roomSessions.length, pairs);
    for (let i = 0; i < game.length; i++) {
      const santaSession = roomSessions[i];
      const playerSession = roomSessions[game[i]];
      this.logger.log('Secret santa choise:', {
        santaSession: santaSession.userName,
        playerSession: playerSession.userName,
      });
      const message = `Тобі випав гравець @${playerSession.userName}.
Його лист:
${playerSession.letter.letter}

Біжи хутчіш купувати подаруночок 🎁🎅🎁
`;
      await this.bot.telegram.sendMessage(santaSession.chatId, message);
    }
    await ctx.sendMessage('Листи всім розіслані)');
  }

  private async buildPairsRestriction(sessions: ChatSessionEntity[]): Promise<[number, number][]> {
    const playerPairs = await this.playerPairRepository.find({
      where: {
        gameRoomId: sessions[0].gameRoomId,
      },
    });
    return playerPairs.map((pair) => {
      const aIndx = sessions.findIndex((it) => pair.aName === it.userName);
      const bIndx = sessions.findIndex((it) => pair.bName === it.userName);
      if (aIndx === -1 || bIndx === -1) {
        throw new Error(`pair inalid ${pair.aName} - ${pair.bName}, ${pair.id}`);
      }
      return [aIndx, bIndx];
    });
  }
}
