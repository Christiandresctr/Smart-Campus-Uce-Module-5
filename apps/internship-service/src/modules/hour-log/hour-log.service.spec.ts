import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HourLogService } from './hour-log.service';
import { HourLog } from './hour-log.entity';

describe('HourLogService', () => {
  let service: HourLogService;
  let repo: jest.Mocked<Repository<HourLog>>;

  const mockHourLog: Partial<HourLog> = {
    id: 'test-uuid-hour-001',
    internship_id: 'test-internship-001',
    log_date: '2026-07-14' as any,
    hours: 8,
    description: 'Test activity',
    location_lat: -0.1807,
    location_lng: -78.4678,
    approved: false,
  };

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HourLogService,
        { provide: getRepositoryToken(HourLog), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<HourLogService>(HourLogService);
    repo = module.get(getRepositoryToken(HourLog));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a hour log for an internship', async () => {
      mockRepo.create.mockReturnValue(mockHourLog as HourLog);
      mockRepo.save.mockResolvedValue(mockHourLog as HourLog);

      const result = await service.create('test-internship-001', {
        log_date: '2026-07-14',
        hours: 8,
        description: 'Test activity',
      });

      expect(mockRepo.create).toHaveBeenCalledWith({
        log_date: '2026-07-14',
        hours: 8,
        description: 'Test activity',
        internship_id: 'test-internship-001',
      });
      expect(result.hours).toBe(8);
    });
  });

  describe('findByInternship', () => {
    it('should return hour logs for an internship', async () => {
      mockRepo.find.mockResolvedValue([mockHourLog] as HourLog[]);

      const result = await service.findByInternship('test-internship-001');

      expect(result).toHaveLength(1);
      expect(mockRepo.find).toHaveBeenCalledWith({ where: { internship_id: 'test-internship-001' } });
    });

    it('should return empty array when no logs exist', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await service.findByInternship('no-logs');

      expect(result).toHaveLength(0);
    });
  });

  describe('remove', () => {
    it('should delete a hour log', async () => {
      mockRepo.delete.mockResolvedValue(undefined);

      await expect(service.remove('test-uuid-hour-001')).resolves.toBeUndefined();
      expect(mockRepo.delete).toHaveBeenCalledWith('test-uuid-hour-001');
    });
  });
});
