import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DocumentController } from './modules/document/document.controller';
import { DocumentService } from './modules/document/document.service';

describe('DocumentController', () => {
  let controller: DocumentController;

  const mockDocumentModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        DocumentService,
        {
          provide: getModelToken('Document'),
          useValue: mockDocumentModel,
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of documents', async () => {
      const result = [];
      mockDocumentModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(result) });
      expect(await controller.findAll()).toBe(result);
    });
  });
});