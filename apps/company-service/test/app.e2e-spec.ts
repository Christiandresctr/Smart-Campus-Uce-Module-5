import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CompanyService (e2e)', () => {
  let app: INestApplication;
  let companyId: number;

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
    name: 'Test Company E2E',
    address: 'Av. Amazonia, Quito',
    ruc: '1792123456001',
    phone: '022345678',
    email: 'test@company.com',
    availableSlots: 5,
  };

  describe('POST /api/v1/company', () => {
    it('should create a new company', () => {
      return request(app.getHttpServer())
        .post('/api/v1/company')
        .send(testData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(testData.name);
          expect(res.body.ruc).toBe(testData.ruc);
          expect(res.body.isActive).toBe(true);
          companyId = res.body.id;
        });
    });
  });

  describe('GET /api/v1/company', () => {
    it('should return an array of companies', () => {
      return request(app.getHttpServer())
        .get('/api/v1/company')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /api/v1/company/:id', () => {
    it('should return a single company', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/company/${companyId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(companyId);
          expect(res.body.name).toBe(testData.name);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('/api/v1/company/99999')
        .expect(404);
    });
  });

  describe('PATCH /api/v1/company/:id', () => {
    it('should update a company', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/company/${companyId}`)
        .send({ availableSlots: 10 })
        .expect(200)
        .expect((res) => {
          expect(res.body.availableSlots).toBe(10);
        });
    });
  });

  describe('DELETE /api/v1/company/:id', () => {
    it('should delete a company', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/company/${companyId}`)
        .expect(200);
    });

    it('should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/company/${companyId}`)
        .expect(404);
    });
  });
});
