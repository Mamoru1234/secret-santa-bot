import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';
import { ChatSessionFetcher } from './chat-session.fetcher';

const providersForExport = [ChatSessionFetcher];

@Module({
  imports: [TypeOrmModule.forFeature([ChatSessionEntity])],
  providers: [...providersForExport],
  exports: providersForExport,
})
export class TgSessionDataModule {}
