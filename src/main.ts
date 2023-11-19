import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { logger } from './logger';
import { Telegraf } from 'telegraf';
import { TgRouterService } from './modules/tg-router/tg-router.service';

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });
  app.enableShutdownHooks();
  logger.info('Launching bot');
  app.get(TgRouterService).configure();
  await app.get(Telegraf).launch();
}

main().catch((e) => logger.error('error in main', e));
