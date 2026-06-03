import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourLogController } from './hour-log.controller';
import { HourLogService } from './hour-log.service';
import { HourLog } from './hour-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HourLog])],
  controllers: [HourLogController],
  providers: [HourLogService],
})
export class HourLogModule {}
