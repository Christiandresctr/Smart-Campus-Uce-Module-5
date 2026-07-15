import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule.entity';
import { RedisService } from '../../redis/redis.service';

const mockSchedule = {
  id: 'uuid-123',
  studentId: '1234567890',
  companyId: 'company-1',
  startDate: '2026-01-01',
  endDate: '2026-06-30',
  dayOfWeek: 1,
  startTime: '08:00',
  endTime: '12:00',
  status: 'active',
};

describe('ScheduleService', () => {
  let service: ScheduleService;
  let repo: any;
  let redis: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: getRepositoryToken(Schedule),
          useValue: {
            create: jest.fn().mockReturnValue(mockSchedule),
            save: jest.fn().mockResolvedValue(mockSchedule),
            find: jest.fn().mockResolvedValue([mockSchedule]),
            findOneBy: jest.fn().mockResolvedValue(mockSchedule),
            findBy: jest.fn().mockResolvedValue([mockSchedule]),
            remove: jest.fn().mockResolvedValue(mockSchedule),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(undefined),
            del: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    repo = module.get(getRepositoryToken(Schedule));
    redis = module.get(RedisService);
  });

  it('should create a schedule', async () => {
    const result = await service.create({
      studentId: '1234567890',
      companyId: 'company-1',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '12:00',
    });
    expect(result).toEqual(mockSchedule);
    expect(redis.del).toHaveBeenCalled();
  });

  it('should find all', async () => {
    expect(await service.findAll()).toEqual([mockSchedule]);
  });

  it('should find one by id', async () => {
    expect(await service.findOne('uuid-123')).toEqual(mockSchedule);
  });

  it('should throw if not found', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne('bad')).rejects.toThrow();
  });
});