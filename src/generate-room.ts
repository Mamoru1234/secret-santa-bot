import 'dotenv/config';
import { randomUUID } from 'crypto';
import { logger } from './logger';
import { AppDataSource } from './modules/db/data-source';
import { GameRoomEntity } from './modules/db/entities/game-room.entity';

const uuid = () =>
  randomUUID({
    disableEntropyCache: true,
  });

async function main(): Promise<void> {
  logger.info('Start generating room');
  const source = await AppDataSource.initialize();
  const gameRoomRepository = source.getRepository(GameRoomEntity);
  const room = await gameRoomRepository.save({
    adminToken: uuid(),
    userToken: uuid(),
  });
  logger.info('Generated room', {
    id: room.id,
    adminToken: room.adminToken,
    userToken: room.userToken,
  });
  await source.destroy();
}

main().catch((e) => logger.error('error in main', e));
