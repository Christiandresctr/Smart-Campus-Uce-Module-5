import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternshipController } from './modules/internship/internship.controller';
import { InternshipService } from './modules/internship/internship.service';
import { Internship } from './modules/internship/internship.entity';

describe('InternshipController', () => {
  let controller: InternshipController;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternshipController],
      providers: [
        InternshipService,
        {
          provide: getRepositoryToken(Internship),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<InternshipController>(InternshipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of internships', async () => {
      const result = [];
      mockRepository.find.mockReturnValue(result);
      expect(await controller.findAll()).toBe(result);
    });
  });
});