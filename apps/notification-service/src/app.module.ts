import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, NotificationModule],
})
export class AppModule {}