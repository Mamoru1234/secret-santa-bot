import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context } from 'telegraf';
import { Repository } from 'typeorm';
import { ActiveStepEntity } from '../db/entities/active-step.entity';
import { BaseEntityFetcher } from './base-entity.fetcher';
import { ChatSessionFetcher } from './chat-session.fetcher';

const ACTIVE_STEP = Symbol.for('ACTIVE_STEP');

@Injectable()
export class ActiveStepFetcher extends BaseEntityFetcher<ActiveStepEntity> {
  constructor(
    @InjectRepository(ActiveStepEntity)
    private readonly activeStepRepository: Repository<ActiveStepEntity>,
    private readonly chatSessionFetcher: ChatSessionFetcher,
  ) {
    super();
  }

  protected async fetch(ctx: Context): Promise<ActiveStepEntity | null> {
    const session = await this.chatSessionFetcher.require(ctx);
    if (!session) {
      throw new Error('No session');
    }
    return this.activeStepRepository.findOne({
      where: {
        session,
      },
    });
  }

  protected getEntityKey(): string | symbol {
    return ACTIVE_STEP;
  }
}
