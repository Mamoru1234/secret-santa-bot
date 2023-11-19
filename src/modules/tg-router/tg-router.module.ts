import { Module } from '@nestjs/common';
import { TelegrafModule } from '../telegraf/telegraf.module';
import { TgRouterService } from './tg-router.service';
import { TgHandlersModule } from '../tg-handlers/tg-handlers.module';

@Module({
  imports: [TelegrafModule, TgHandlersModule],
  providers: [TgRouterService],
  exports: [TgRouterService],
})
export class TgRouterModule {}
