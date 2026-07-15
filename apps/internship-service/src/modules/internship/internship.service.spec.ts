import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternshipService } from './internship.service';
import { Internship } from './internship.entity';
import { NotFoundException } from '@nestjs/common';

describe('InternshipService', () => {
  let service: InternshipService;
  let repo: jest.Mocked<Repository<Internship>>;

  const mockInternship: Partial<Internship> = {
    id: 'test-uuid-001',
    student_id: 'student-001',
    company_name: 'Test Company',
    company_address: 'Quito',
    start_date: '2026-01-01' as any,
    end_date: '2026-06-30' as any,
    total_hours_required: 320,
    total_hours_completed: 0,
    status: 'draft',
  };

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InternshipService,
        { provide: getRepositoryToken(Internship), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<InternshipService>(InternshipService);
    repo = module.get(getRepositoryToken(Internship));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an internship', async () => {
      mockRepo.create.mockReturnValue(mockInternship as Internship);
      mockRepo.save.mockResolvedValue(mockInternship as Internship);

      const result = await service.create({
        student_id: 'student-001',
        company_name: 'Test Company',
        start_date: '2026-01-01',
        end_date: '2026-06-30',
      });

      expect(mockRepo.create).toHaveBeenCalled();
      expect(result.student_id).toBe('student-001');
      expect(result.status).toBe('draft');
    });
  });

  describe('findAll', () => {
    it('should return all internships', async () => {
      mockRepo.find.mockResolvedValue([mockInternship] as Internship[]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return an internship by id', async () => {
      mockRepo.findOne.mockResolvedValue(mockInternship as Internship);

      const result = await service.findOne('test-uuid-001');

      expect(result.id).toBe('test-uuid-001');
    });

    it('should throw NotFoundException', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByStudent', () => {
    it('should return internships for a student', async () => {
      mockRepo.find.mockResolvedValue([mockInternship] as Internship[]);

      const result = await service.findByStudent('student-001');

      expect(result).toHaveLength(1);
      expect(mockRepo.find).toHaveBeenCalledWith({ where: { student_id: 'student-001' } });
    });
  });

  describe('update', () => {
    it('should update an internship', async () => {
      mockRepo.update.mockResolvedValue(undefined);
      mockRepo.findOne.mockResolvedValue({ ...mockInternship, company_name: 'Updated' } as Internship);

      const result = await service.update('test-uuid-001', { company_name: 'Updated' });

      expect(result.company_name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete an internship', async () => {
      mockRepo.delete.mockResolvedValue(undefined);

      await expect(service.remove('test-uuid-001')).resolves.toBeUndefined();
      expect(mockRepo.delete).toHaveBeenCalledWith('test-uuid-001');
    });
  });
});
