import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const reqDuration = new Trend('req_duration');

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 50 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:80';

let internshipId = null;

export default function () {
  const createPayload = JSON.stringify({
    student_id: `student-${__VU}-${__ITER}`,
    company_name: 'Test Company',
    company_address: 'Quito, Ecuador',
    start_date: '2026-01-01',
    end_date: '2026-06-30',
    total_hours_required: 320,
  });

  const createParams = {
    headers: { 'Content-Type': 'application/json' },
  };

  const createRes = http.post(`${BASE_URL}/api/v1/internship`, createPayload, createParams);
  check(createRes, {
    'create internship status 201': (r) => r.status === 201,
    'create internship has id': (r) => r.json('id') !== undefined,
  }) || errorRate.add(1);
  reqDuration.add(createRes.timings.duration);

  if (createRes.status === 201) {
    internshipId = createRes.json('id');
  }

  sleep(0.5);

  const listRes = http.get(`${BASE_URL}/api/v1/internship`);
  check(listRes, {
    'list internships status 200': (r) => r.status === 200,
    'list internships is array': (r) => Array.isArray(r.json()),
  }) || errorRate.add(1);
  reqDuration.add(listRes.timings.duration);

  sleep(0.5);

  if (internshipId) {
    const getRes = http.get(`${BASE_URL}/api/v1/internship/${internshipId}`);
    check(getRes, {
      'get internship status 200': (r) => r.status === 200,
      'get internship has correct id': (r) => r.json('id') === internshipId,
    }) || errorRate.add(1);
    reqDuration.add(getRes.timings.duration);

    sleep(0.5);

    const studentRes = http.get(`${BASE_URL}/api/v1/internship/student/student-${__VU}-${__ITER}`);
    check(studentRes, {
      'get by student status 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    reqDuration.add(studentRes.timings.duration);

    sleep(0.5);

    const hoursPayload = JSON.stringify({
      log_date: new Date().toISOString(),
      hours: 8,
      description: 'Load test activity',
      location_lat: -0.1807,
      location_lng: -78.4678,
    });

    const hoursRes = http.post(`${BASE_URL}/api/v1/internship/${internshipId}/hours`, hoursPayload, createParams);
    check(hoursRes, {
      'log hours status 201': (r) => r.status === 201,
    }) || errorRate.add(1);
    reqDuration.add(hoursRes.timings.duration);

    sleep(0.5);

    const getHoursRes = http.get(`${BASE_URL}/api/v1/internship/${internshipId}/hours`);
    check(getHoursRes, {
      'get hours status 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    reqDuration.add(getHoursRes.timings.duration);
  }

  sleep(1);
}
