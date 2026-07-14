import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

describe('CompanyController', () => {
  let controller: CompanyController;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [{ provide: CompanyService, useValue: mockService }],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll → should return companies', async () => {
    const result = [{ id: 1, name: 'Test' }];
    mockService.findAll.mockReturnValue(result);
    expect(await controller.findAll()).toEqual(result);
  });

  it('create → should create company', async () => {
    const dto = { name: 'New Co', address: 'Q', ruc: '123' };
    mockService.create.mockReturnValue(dto);
    expect(await controller.create(dto as any)).toEqual(dto);
  });
});