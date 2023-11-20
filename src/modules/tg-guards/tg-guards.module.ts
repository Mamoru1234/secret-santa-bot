import { Module } from '@nestjs/common';
import { TgSessionDataModule } from '../tg-session-data/tg-session-data.module';
import { SessionGuardFactory } from './session-guard.factory';

const providersForExport = [SessionGuardFactory];

@Module({
  imports: [TgSessionDataModule],
  providers: [...providersForExport],
  exports: providersForExport,
})
export class TgGuardsModule {}
