import { Module } from '@nestjs/common';
import { TgHandlersService } from './tg-handlers.service';
import { APP_HANDLERS } from './handlers';

@Module({
  imports: [],
  providers: [TgHandlersService, ...APP_HANDLERS],
  exports: [TgHandlersService],
})
export class TgHandlersModule {}
