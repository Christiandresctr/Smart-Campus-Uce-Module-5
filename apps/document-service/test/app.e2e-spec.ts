import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('DocumentService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/document/upload', () => {
    it('should upload a document', () => {
      const buffer = Buffer.from('test file content for e2e');
      return request(app.getHttpServer())
        .post('/api/v1/document/upload')
        .field('internship_id', 'test-internship-001')
        .field('document_type', 'aval_academico')
        .field('uploaded_by', 'test-user-001')
        .attach('file', buffer, { filename: 'test-doc.pdf', contentType: 'application/pdf' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.internship_id).toBe('test-internship-001');
          expect(res.body.document_type).toBe('aval_academico');
          expect(res.body.file_name).toBe('test-doc.pdf');
          expect(res.body.file_hash).toBeDefined();
          expect(res.body.version).toBe(1);
        });
    });
  });

  describe('GET /api/v1/document', () => {
    it('should return an array of documents', () => {
      return request(app.getHttpServer())
        .get('/api/v1/document')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /api/v1/document/internship/:internshipId', () => {
    it('should return documents for an internship', () => {
      return request(app.getHttpServer())
        .get('/api/v1/document/internship/test-internship-001')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /api/v1/document/:id', () => {
    it('should return 404 for non-existent document', () => {
      return request(app.getHttpServer())
        .get('/api/v1/document/000000000000000000000000')
        .expect(404);
    });
  });

  describe('DELETE /api/v1/document/:id', () => {
    it('should delete a document', async () => {
      const uploadRes = await request(app.getHttpServer())
        .post('/api/v1/document/upload')
        .field('internship_id', 'test-delete-001')
        .field('document_type', 'informe')
        .field('uploaded_by', 'test-user-001')
        .attach('file', Buffer.from('delete me'), { filename: 'delete.pdf', contentType: 'application/pdf' });

      const docId = uploadRes.body._id;

      return request(app.getHttpServer())
        .delete(`/api/v1/document/${docId}`)
        .expect(200);
    });
  });
});
