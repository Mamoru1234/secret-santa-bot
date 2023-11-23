import 'dotenv/config';
import { logger } from './logger';
import { AppDataSource } from './modules/db/data-source';
import { In, Repository } from 'typeorm';
import { ChatSessionEntity } from './modules/db/entities/chat-session.entity';
import { PlayerPairEntity } from './modules/db/entities/player-pair.entity';
import { flatten, uniq } from 'lodash';

async function validatePairs(chatSessionRepository: Repository<ChatSessionEntity>, roomId: string, pairs: string[][]) {
  for (const pair of pairs) {
    if (pair.length !== 2) {
      throw new Error('Wrong pair size');
    }
    const count = await chatSessionRepository.count({
      where: {
        userName: In(pair),
        gameRoomId: roomId,
      },
    });
    if (count !== 2) {
      throw new Error('Wrong pair setup session not found');
    }
  }
}

function validatePairConflicts(pairs: string[][]): void {
  const allParticipants = flatten(pairs);
  if (allParticipants.length !== uniq(allParticipants).length) {
    throw new Error('Some pair has duplication');
  }
}

async function main(): Promise<void> {
  logger.info('Start generating room');
  const roomId = process.argv[2];
  const pairs = process.argv[3]?.split(',')?.map((it) => it.trim().split('@'));
  validatePairConflicts(pairs);
  logger.info('Input', { roomId, pairs });
  if (!roomId || !pairs || !pairs.length) {
    throw new Error('invalid input');
  }
  const source = await AppDataSource.initialize();
  try {
    await validatePairs(source.getRepository(ChatSessionEntity), roomId, pairs);
    const playerPairRepository = source.getRepository(PlayerPairEntity);
    await playerPairRepository.delete({ gameRoomId: roomId });
    logger.info('Clean-up and validation completed');
    await playerPairRepository.save(
      pairs.map((it) => ({
        gameRoomId: roomId,
        aName: it[0],
        bName: it[1],
      })),
    );
  } finally {
    await source.destroy();
  }
}

main().catch((e) => logger.error('error in main', e));
