import { Module } from '@nestjs/common';
import { TgSessionDataModule } from '../tg-session-data/tg-session-data.module';
import { SessionGuardFactory } from './session-guard.factory';
import { ActiveStepGuardFactory } from './active-step-guard.factory';

const providersForExport = [SessionGuardFactory, ActiveStepGuardFactory];

@Module({
  imports: [TgSessionDataModule],
  providers: [...providersForExport],
  exports: providersForExport,
})
export class TgGuardsModule {}
