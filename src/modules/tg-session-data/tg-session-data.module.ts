import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';
import { ChatSessionFetcher } from './chat-session.fetcher';
import { ActiveStepFetcher } from './active-step.fetcher';
import { ActiveStepEntity } from '../db/entities/active-step.entity';

const providersForExport = [ChatSessionFetcher, ActiveStepFetcher];

@Module({
  imports: [TypeOrmModule.forFeature([ChatSessionEntity, ActiveStepEntity])],
  providers: [...providersForExport],
  exports: providersForExport,
})
export class TgSessionDataModule {}
