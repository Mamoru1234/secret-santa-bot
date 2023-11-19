import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { logMiddleware } from '../telegraf/log.middleware';
import { TgHandlersService } from '../tg-handlers/tg-handlers.service';
import { APP_HANDLERS } from '../tg-handlers/handlers';

@Injectable()
export class TgRouterService {
  private readonly logger = new Logger(TgRouterService.name);
  constructor(
    private readonly bot: Telegraf,
    private readonly tgHandlersService: TgHandlersService,
  ) {}

  configure(): void {
    this.bot.use(
      logMiddleware((mes, update) =>
        this.logger.log(mes, {
          update,
        }),
      ),
    );
    this.tgHandlersService.register(this.bot, APP_HANDLERS);
  }
}
