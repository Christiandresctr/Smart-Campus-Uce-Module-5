import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { Company } from './company.entity';

describe('CompanyService', () => {
  let service: CompanyService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOneByOrFail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: getRepositoryToken(Company), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll → should return companies', async () => {
    const result = [{ id: 1, name: 'Test' }];
    mockRepository.find.mockReturnValue(result);
    expect(await service.findAll()).toEqual(result);
  });

  it('create → should save and return company', async () => {
    const dto = { name: 'New Co', address: 'Quito', ruc: '123' };
    mockRepository.create.mockReturnValue(dto);
    mockRepository.save.mockReturnValue({ id: 1, ...dto });
    expect(await service.create(dto as any)).toEqual({ id: 1, ...dto });
  });

  it('remove → should delete company', async () => {
    mockRepository.delete.mockReturnValue({ affected: 1 });
    await expect(service.remove(1)).resolves.toBeUndefined();
  });
});