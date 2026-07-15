import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DocumentService } from './document.service';
import { Document } from './document.schema';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

describe('DocumentService', () => {
  let service: DocumentService;
  let model: jest.Mocked<Model<Document>>;

  const mockDocument = {
    _id: 'test-mongo-id-001',
    internship_id: 'test-internship-001',
    document_type: 'aval_academico',
    file_name: 'test.pdf',
    file_url: '/api/v1/document/test.pdf',
    file_size: 1024,
    file_hash: 'abc123hash',
    version: 1,
    uploaded_by: 'user-001',
  };

  const mockModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: getModelToken(Document.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    model = module.get(getModelToken(Document.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      mockModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([mockDocument]) } as any);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a document by id', async () => {
      mockModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDocument) } as any);

      const result = await service.findOne('test-mongo-id-001');

      expect(result._id).toBe('test-mongo-id-001');
    });

    it('should throw NotFoundException', async () => {
      mockModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as any);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByInternship', () => {
    it('should return documents for an internship', async () => {
      mockModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([mockDocument]) } as any);

      const result = await service.findByInternship('test-internship-001');

      expect(result).toHaveLength(1);
    });
  });

  describe('remove', () => {
    it('should delete a document', async () => {
      mockModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDocument) } as any);

      await expect(service.remove('test-mongo-id-001')).resolves.toBeUndefined();
    });
  });
});
