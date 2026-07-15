import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuditLogService (e2e)', () => {
  let app: INestApplication;
  let auditId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const testData = {
    action: 'CREATE',
    entity: 'Internship',
    entityId: 'test-internship-001',
    userId: 'user-001',
    details: { description: 'E2E test audit entry' },
  };

  describe('POST /api/v1/audit', () => {
    it('should create an audit entry', () => {
      return request(app.getHttpServer())
        .post('/api/v1/audit')
        .send(testData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.action).toBe(testData.action);
          expect(res.body.entity).toBe(testData.entity);
          auditId = res.body._id;
        });
    });
  });

  describe('GET /api/v1/audit', () => {
    it('should return an array of audit entries', () => {
      return request(app.getHttpServer())
        .get('/api/v1/audit')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /api/v1/audit/:id', () => {
    it('should return a single audit entry', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/audit/${auditId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(auditId);
          expect(res.body.action).toBe(testData.action);
        });
    });
  });

  describe('DELETE /api/v1/audit/:id', () => {
    it('should delete an audit entry', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/audit/${auditId}`)
        .expect(200);
    });
  });
});
