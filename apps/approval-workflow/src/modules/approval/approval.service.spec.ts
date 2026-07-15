import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalService } from './approval.service';
import { Approval } from './approval.entity';
import { NotFoundException } from '@nestjs/common';

describe('ApprovalService', () => {
  let service: ApprovalService;
  let repo: jest.Mocked<Repository<Approval>>;

  const mockApproval: Partial<Approval> = {
    id: 'test-uuid-001',
    internship_id: 'test-internship-001',
    current_step: 'tutor',
    status: 'pending',
    signatures: {},
  };

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApprovalService,
        { provide: getRepositoryToken(Approval), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ApprovalService>(ApprovalService);
    repo = module.get(getRepositoryToken(Approval));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an approval with tutor step', async () => {
      mockRepo.create.mockReturnValue(mockApproval as Approval);
      mockRepo.save.mockResolvedValue(mockApproval as Approval);

      const result = await service.create({ internship_id: 'test-internship-001' });

      expect(mockRepo.create).toHaveBeenCalledWith({
        internship_id: 'test-internship-001',
        current_step: 'tutor',
        status: 'pending',
      });
      expect(result.current_step).toBe('tutor');
      expect(result.status).toBe('pending');
    });
  });

  describe('findAll', () => {
    it('should return all approvals', async () => {
      mockRepo.find.mockResolvedValue([mockApproval] as Approval[]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an approval by id', async () => {
      mockRepo.findOne.mockResolvedValue(mockApproval as Approval);

      const result = await service.findOne('test-uuid-001');

      expect(result.id).toBe('test-uuid-001');
    });

    it('should throw NotFoundException for non-existent id', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByInternship', () => {
    it('should return approvals for an internship', async () => {
      mockRepo.find.mockResolvedValue([mockApproval] as Approval[]);

      const result = await service.findByInternship('test-internship-001');

      expect(result).toHaveLength(1);
      expect(mockRepo.find).toHaveBeenCalledWith({ where: { internship_id: 'test-internship-001' } });
    });
  });

  describe('approve', () => {
    it('should advance from tutor to coordinator', async () => {
      mockRepo.findOne.mockResolvedValue(mockApproval as Approval);
      mockRepo.save.mockImplementation((a) => Promise.resolve(a as Approval));

      const result = await service.approve('test-uuid-001', { comment: 'Approved' });

      expect(result.current_step).toBe('coordinator');
      expect(result.signatures).toHaveProperty('tutor');
    });

    it('should advance from coordinator to dean', async () => {
      const coordinatorApproval = { ...mockApproval, current_step: 'coordinator' };
      mockRepo.findOne.mockResolvedValue(coordinatorApproval as Approval);
      mockRepo.save.mockImplementation((a) => Promise.resolve(a as Approval));

      const result = await service.approve('test-uuid-001', { comment: 'Approved' });

      expect(result.current_step).toBe('dean');
      expect(result.signatures).toHaveProperty('coordinator');
    });

    it('should finalize when dean approves', async () => {
      const deanApproval = { ...mockApproval, current_step: 'dean' };
      mockRepo.findOne.mockResolvedValue(deanApproval as Approval);
      mockRepo.save.mockImplementation((a) => Promise.resolve(a as Approval));

      const result = await service.approve('test-uuid-001', { comment: 'Final approve' });

      expect(result.status).toBe('approved');
      expect(result.current_step).toBe('completed');
      expect(result.signatures).toHaveProperty('dean');
    });
  });

  describe('reject', () => {
    it('should reject an approval', async () => {
      mockRepo.findOne.mockResolvedValue(mockApproval as Approval);
      mockRepo.save.mockImplementation((a) => Promise.resolve(a as Approval));

      const result = await service.reject('test-uuid-001', { comment: 'Rejected' });

      expect(result.status).toBe('rejected');
      expect(result.signatures).toHaveProperty('tutor');
    });
  });
});
