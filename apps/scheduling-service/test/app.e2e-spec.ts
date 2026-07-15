import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('SchedulingService (e2e)', () => {
  let app: INestApplication;
  let scheduleId: string;

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
    studentId: 'student-schedule-001',
    companyId: 1,
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '17:00',
  };

  describe('POST /schedule', () => {
    it('should create a new schedule', () => {
      return request(app.getHttpServer())
        .post('/schedule')
        .send(testData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.studentId).toBe(testData.studentId);
          expect(res.body.status).toBe('active');
          scheduleId = res.body.id;
        });
    });
  });

  describe('GET /schedule', () => {
    it('should return an array of schedules', () => {
      return request(app.getHttpServer())
        .get('/schedule')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /schedule/:id', () => {
    it('should return a single schedule', () => {
      return request(app.getHttpServer())
        .get(`/schedule/${scheduleId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(scheduleId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('/schedule/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('GET /schedule/student/:studentId', () => {
    it('should return schedules for a student', () => {
      return request(app.getHttpServer())
        .get(`/schedule/student/${testData.studentId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('PATCH /schedule/:id', () => {
    it('should update a schedule', () => {
      return request(app.getHttpServer())
        .patch(`/schedule/${scheduleId}`)
        .send({ endTime: '18:00' })
        .expect(200)
        .expect((res) => {
          expect(res.body.endTime).toBe('18:00');
        });
    });
  });

  describe('DELETE /schedule/:id', () => {
    it('should delete a schedule', () => {
      return request(app.getHttpServer())
        .delete(`/schedule/${scheduleId}`)
        .expect(200);
    });

    it('should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/schedule/${scheduleId}`)
        .expect(404);
    });
  });
});
