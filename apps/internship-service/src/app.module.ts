import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { InternshipModule } from './modules/internship/internship.module';
import { HourLogModule } from './modules/hour-log/hour-log.module';

@Module({
  imports: [DatabaseModule, InternshipModule, HourLogModule],
})
export class AppModule {}
