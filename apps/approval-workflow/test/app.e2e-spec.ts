import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ApprovalWorkflow (e2e)', () => {
  let app: INestApplication;
  let approvalId: string;
  let internshipId = '00000000-0000-0000-0000-000000000001';

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

  describe('POST /api/v1/approval/start', () => {
    it('should start an approval flow', () => {
      return request(app.getHttpServer())
        .post('/api/v1/approval/start')
        .send({ internship_id: internshipId })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.internship_id).toBe(internshipId);
          expect(res.body.current_step).toBe('tutor');
          expect(res.body.status).toBe('pending');
          approvalId = res.body.id;
        });
    });
  });

  describe('GET /api/v1/approval', () => {
    it('should return an array of approvals', () => {
      return request(app.getHttpServer())
        .get('/api/v1/approval')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /api/v1/approval/:id', () => {
    it('should return a single approval', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/approval/${approvalId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(approvalId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('/api/v1/approval/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('GET /api/v1/approval/status/:internshipId', () => {
    it('should return approvals for an internship', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/approval/status/${internshipId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('PUT /api/v1/approval/:id/approve', () => {
    it('should approve at tutor step and advance to coordinator', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/approval/${approvalId}/approve`)
        .send({ comment: 'Tutor approved' })
        .expect(200)
        .expect((res) => {
          expect(res.body.current_step).toBe('coordinator');
          expect(res.body.status).toBe('pending');
          expect(res.body.signatures).toHaveProperty('tutor');
        });
    });

    it('should approve at coordinator step and advance to dean', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/approval/${approvalId}/approve`)
        .send({ comment: 'Coordinator approved' })
        .expect(200)
        .expect((res) => {
          expect(res.body.current_step).toBe('dean');
          expect(res.body.signatures).toHaveProperty('coordinator');
        });
    });

    it('should approve at dean step and finalize', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/approval/${approvalId}/approve`)
        .send({ comment: 'Dean approved' })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('approved');
          expect(res.body.current_step).toBe('completed');
          expect(res.body.signatures).toHaveProperty('dean');
        });
    });
  });

  describe('PUT /api/v1/approval/:id/reject', () => {
    it('should create and reject a new approval', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/approval/start')
        .send({ internship_id: '00000000-0000-0000-0000-000000000002' });

      const newId = createRes.body.id;

      return request(app.getHttpServer())
        .put(`/api/v1/approval/${newId}/reject`)
        .send({ comment: 'Rejected by tutor' })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('rejected');
        });
    });
  });
});
