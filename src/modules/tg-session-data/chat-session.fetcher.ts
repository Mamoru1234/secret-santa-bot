import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Repository } from 'typeorm';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';
import { BaseEntityFetcher } from './base-entity.fetcher';

const SESSION_KEY = Symbol.for('CHAT_SESSION_FETCHER');

@Injectable()
export class ChatSessionFetcher extends BaseEntityFetcher<ChatSessionEntity> {
  constructor(@InjectRepository(ChatSessionEntity) private readonly chatSesssionRepository: Repository<ChatSessionEntity>) {
    super();
  }

  protected async fetch(ctx: Context<Update>): Promise<ChatSessionEntity | null> {
    if (!ctx.chat) {
      throw new Error('No chat in ctx');
    }
    return this.chatSesssionRepository.findOne({
      where: {
        chatId: `${ctx.chat.id}`,
      },
    });
  }

  protected getEntityKey(): string | symbol {
    return SESSION_KEY;
  }
}
