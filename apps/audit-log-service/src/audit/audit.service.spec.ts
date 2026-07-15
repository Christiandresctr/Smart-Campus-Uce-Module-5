import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuditService } from './audit.service';
import { Audit } from './audit.entity';

describe('AuditService', () => {
  let service: AuditService;

  const mockModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: getModelToken(Audit.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll → should return audits', async () => {
    const result = [{ action: 'CREATE', entity: 'Company' }];
    mockModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(result) });
    expect(await service.findAll()).toEqual(result);
  });
});