import {
  Controller, Get, Post, Delete,
  Body, Param, ParseUUIDPipe,
} from '@nestjs/common';
import { HourLogService } from './hour-log.service';
import { CreateHourLogDto } from './create-hour-log.dto';
import { HourLog } from './hour-log.entity';

@Controller('api/v1/internship')
export class HourLogController {
  constructor(private service: HourLogService) {}

  @Post(':id/hours')
  create(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateHourLogDto,
  ): Promise<HourLog> {
    return this.service.create(id, dto);
  }

  @Get(':id/hours')
  findByInternship(@Param('id', ParseUUIDPipe) id: string): Promise<HourLog[]> {
    return this.service.findByInternship(id);
  }

  @Delete(':id/hours/:hourId')
  remove(@Param('hourId', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }
}