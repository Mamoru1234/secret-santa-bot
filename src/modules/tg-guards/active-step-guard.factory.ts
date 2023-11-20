import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { Guard } from '../telegraf/guard.utils';
import { ActiveStepFetcher } from '../tg-session-data/active-step.fetcher';

@Injectable()
export class ActiveStepGuardFactory {
  constructor(private readonly activeStepFetcher: ActiveStepFetcher) {}

  byType(type: string): Guard {
    return async (ctx: Context) => {
      const activeStep = await this.activeStepFetcher.get(ctx);
      if (!activeStep) {
        return false;
      }
      return activeStep.type === type;
    };
  }
}
