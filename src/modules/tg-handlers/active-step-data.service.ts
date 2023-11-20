import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context } from 'telegraf';
import { Repository } from 'typeorm';
import { ActiveStepEntity } from '../db/entities/active-step.entity';
import { ActiveStepFetcher } from '../tg-session-data/active-step.fetcher';
import { ChatSessionFetcher } from '../tg-session-data/chat-session.fetcher';

@Injectable()
export class ActiveStepDataService {
  constructor(
    @InjectRepository(ActiveStepEntity)
    private readonly activeStepRepository: Repository<ActiveStepEntity>,
    private readonly chatSessionFetcher: ChatSessionFetcher,
    private readonly activeStepFetcher: ActiveStepFetcher,
  ) {}

  async updateStepData<TData>(ctx: Context, type: string, data: TData): Promise<void> {
    const session = await this.chatSessionFetcher.require(ctx);
    await this.activeStepRepository.update(
      {
        session,
      },
      {
        type,
        data: data as never, // some typeorm bug unknown do not fit the typying
      },
    );
  }

  async getData<TData>(ctx: Context): Promise<TData> {
    const step = await this.activeStepFetcher.require(ctx);
    if (!step.data) {
      throw new Error('No step data');
    }
    return step.data as TData;
  }
}
