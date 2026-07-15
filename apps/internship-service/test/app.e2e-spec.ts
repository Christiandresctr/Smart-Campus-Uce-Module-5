import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('InternshipService (e2e)', () => {
  let app: INestApplication;
  let internshipId: string;

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
    student_id: 'test-student-001',
    company_name: 'Test Company E2E',
    company_address: 'Quito, Ecuador',
    start_date: '2026-01-01',
    end_date: '2026-06-30',
    total_hours_required: 320,
  };

  describe('POST /api/v1/internship', () => {
    it('should create a new internship', () => {
      return request(app.getHttpServer())
        .post('/api/v1/internship')
        .send(testData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.student_id).toBe(testData.student_id);
          expect(res.body.company_name).toBe(testData.company_name);
          expect(res.body.status).toBe('draft');
          internshipId = res.body.id;
        });
    });

    it('should reject invalid data', () => {
      return request(app.getHttpServer())
        .post('/api/v1/internship')
        .send({ student_id: '' })
        .expect(400);
    });
  });

  describe('GET /api/v1/internship', () => {
    it('should return an array of internships', () => {
      return request(app.getHttpServer())
        .get('/api/v1/internship')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /api/v1/internship/:id', () => {
    it('should return a single internship', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/internship/${internshipId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(internshipId);
          expect(res.body.student_id).toBe(testData.student_id);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('/api/v1/internship/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('GET /api/v1/internship/student/:studentId', () => {
    it('should return internships for a student', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/internship/student/${testData.student_id}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('PUT /api/v1/internship/:id', () => {
    it('should update an internship', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/internship/${internshipId}`)
        .send({ company_name: 'Updated Company' })
        .expect(200)
        .expect((res) => {
          expect(res.body.company_name).toBe('Updated Company');
        });
    });
  });

  describe('POST /api/v1/internship/:id/hours', () => {
    it('should log hours for an internship', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/internship/${internshipId}/hours`)
        .send({
          log_date: '2026-07-14',
          hours: 8,
          description: 'E2E test activity',
          location_lat: -0.1807,
          location_lng: -78.4678,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.hours).toBe(8);
        });
    });
  });

  describe('GET /api/v1/internship/:id/hours', () => {
    it('should return hour logs for an internship', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/internship/${internshipId}/hours`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('DELETE /api/v1/internship/:id', () => {
    it('should delete an internship', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/internship/${internshipId}`)
        .expect(200);
    });

    it('should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/internship/${internshipId}`)
        .expect(404);
    });
  });
});
