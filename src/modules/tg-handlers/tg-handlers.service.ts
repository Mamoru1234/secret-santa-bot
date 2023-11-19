import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Telegraf } from 'telegraf';

export interface TgHandler {
  configure(bot: Telegraf): void;
}

@Injectable()
export class TgHandlersService {
  constructor(private readonly moduleRef: ModuleRef) {}

  register(bot: Telegraf, handlers: Type<TgHandler>[]) {
    const instances = handlers.map((it) => this.moduleRef.get(it));
    for (const instance of instances) {
      instance.configure(bot);
    }
  }
}
