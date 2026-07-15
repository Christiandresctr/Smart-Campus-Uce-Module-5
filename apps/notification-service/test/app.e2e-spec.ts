import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('NotificationService (e2e)', () => {
  let app: INestApplication;
  let notificationId: string;

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
    userId: 'user-001',
    title: 'Test Notification',
    message: 'This is a test notification for E2E',
    type: 'info',
  };

  describe('POST /notification', () => {
    it('should create a notification', () => {
      return request(app.getHttpServer())
        .post('/notification')
        .send(testData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.userId).toBe(testData.userId);
          expect(res.body.title).toBe(testData.title);
          expect(res.body.read).toBe(false);
          notificationId = res.body._id;
        });
    });
  });

  describe('GET /notification', () => {
    it('should return an array of notifications', () => {
      return request(app.getHttpServer())
        .get('/notification')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /notification/:id', () => {
    it('should return a single notification', () => {
      return request(app.getHttpServer())
        .get(`/notification/${notificationId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(notificationId);
          expect(res.body.title).toBe(testData.title);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('/notification/000000000000000000000000')
        .expect(404);
    });
  });

  describe('PATCH /notification/:id', () => {
    it('should mark notification as read', () => {
      return request(app.getHttpServer())
        .patch(`/notification/${notificationId}`)
        .send({ read: true })
        .expect(200)
        .expect((res) => {
          expect(res.body.read).toBe(true);
        });
    });
  });

  describe('DELETE /notification/:id', () => {
    it('should delete a notification', () => {
      return request(app.getHttpServer())
        .delete(`/notification/${notificationId}`)
        .expect(200);
    });

    it('should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/notification/${notificationId}`)
        .expect(404);
    });
  });
});
