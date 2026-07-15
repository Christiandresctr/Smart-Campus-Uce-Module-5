import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { ScheduleModule } from './modules/schedule/schedule.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, RedisModule, ScheduleModule],
})
export class AppModule {}