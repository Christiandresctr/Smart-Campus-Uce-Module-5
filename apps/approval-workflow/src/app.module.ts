import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ApprovalModule } from './modules/approval/approval.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, ApprovalModule],
})
export class AppModule {}