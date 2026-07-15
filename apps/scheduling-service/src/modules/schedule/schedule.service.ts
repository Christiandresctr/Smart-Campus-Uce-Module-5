import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule) private repo: Repository<Schedule>,
    private redis: RedisService,
  ) {}

  async create(dto: CreateScheduleDto) {
    const schedule = this.repo.create(dto);
    const saved = await this.repo.save(schedule);
    await this.redis.del(`schedules:${saved.studentId}`);
    return saved;
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const schedule = await this.repo.findOneBy({ id });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async findByStudent(studentId: string) {
    const cached = await this.redis.get(`schedules:${studentId}`);
    if (cached) return JSON.parse(cached);

    const schedules = await this.repo.findBy({ studentId });
    await this.redis.set(`schedules:${studentId}`, JSON.stringify(schedules));
    return schedules;
  }

  async update(id: string, dto: UpdateScheduleDto) {
    const schedule = await this.findOne(id);
    Object.assign(schedule, dto);
    const saved = await this.repo.save(schedule);
    await this.redis.del(`schedules:${saved.studentId}`);
    return saved;
  }

  async remove(id: string) {
    const schedule = await this.findOne(id);
    await this.repo.remove(schedule);
    await this.redis.del(`schedules:${schedule.studentId}`);
    return schedule;
  }
}