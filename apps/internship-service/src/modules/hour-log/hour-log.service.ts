import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HourLog } from './hour-log.entity';
import { CreateHourLogDto } from './create-hour-log.dto';

@Injectable()
export class HourLogService {
  constructor(
    @InjectRepository(HourLog)
    private repo: Repository<HourLog>,
  ) {}

  async create(internshipId: string, dto: CreateHourLogDto): Promise<HourLog> {
    const hourLog = this.repo.create({ ...dto, internship_id: internshipId });
    return this.repo.save(hourLog);
  }

  async findByInternship(internshipId: string): Promise<HourLog[]> {
    return this.repo.find({ where: { internship_id: internshipId } });
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}