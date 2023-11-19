import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './modules/db/data-source';
import { TelegrafModule } from './modules/telegraf/telegraf.module';
import { TgRouterModule } from './modules/tg-router/tg-router.module';

@Module({
  imports: [TelegrafModule, TypeOrmModule.forRoot(AppDataSource.options), TgRouterModule],
})
export class AppModule {}
