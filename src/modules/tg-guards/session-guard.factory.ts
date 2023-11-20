import { Injectable } from '@nestjs/common';
import { Guard } from '../telegraf/guard.utils';
import { ChatSessionFetcher } from '../tg-session-data/chat-session.fetcher';

@Injectable()
export class SessionGuardFactory {
  constructor(private readonly chatSessionFetcher: ChatSessionFetcher) {}

  noSession(): Guard {
    return async (ctx) => {
      const session = await this.chatSessionFetcher.get(ctx);
      return session === null;
    };
  }

  withSession(): Guard {
    return async (ctx) => {
      const session = await this.chatSessionFetcher.get(ctx);
      return session !== null;
    };
  }
}
