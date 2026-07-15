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

export default function () {
  const cedula = `${1710000000 + __VU}`;

  const studentPayload = JSON.stringify({
    student_id: cedula,
    full_name: `Student ${__VU}`,
    email: `student${__VU}@uce.edu.ec`,
    career: 'Sistemas Computacionales',
  });

  const createParams = {
    headers: { 'Content-Type': 'application/json' },
  };

  const studentRes = http.post(`${BASE_URL}/reports/students`, studentPayload, createParams);
  check(studentRes, {
    'create student status 200 or 201': (r) => r.status === 200 || r.status === 201,
  }) || errorRate.add(1);
  reqDuration.add(studentRes.timings.duration);

  sleep(0.5);

  const getStudentRes = http.get(`${BASE_URL}/reports/students/${cedula}`);
  check(getStudentRes, {
    'get student status 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  reqDuration.add(getStudentRes.timings.duration);

  sleep(0.5);

  const hourPayload = JSON.stringify({
    student_id: cedula,
    hours: 8,
    description: `Load test day ${__ITER}`,
    log_date: new Date().toISOString(),
  });

  const hourRes = http.post(`${BASE_URL}/reports/hours`, hourPayload, createParams);
  check(hourRes, {
    'log hours status 200 or 201': (r) => r.status === 200 || r.status === 201,
  }) || errorRate.add(1);
  reqDuration.add(hourRes.timings.duration);

  sleep(0.5);

  const reportRes = http.get(`${BASE_URL}/reports/report/hours/${cedula}`);
  check(reportRes, {
    'report hours status 200': (r) => r.status === 200,
    'report has total_hours': (r) => r.json('total_hours') !== undefined,
  }) || errorRate.add(1);
  reqDuration.add(reportRes.timings.duration);

  sleep(0.5);

  const certPayload = JSON.stringify({
    student_id: cedula,
    total_hours: 320,
  });

  const certRes = http.post(`${BASE_URL}/reports/report/certificate`, certPayload, createParams);
  check(certRes, {
    'generate certificate status 200 or 201': (r) => r.status === 200 || r.status === 201,
  }) || errorRate.add(1);
  reqDuration.add(certRes.timings.duration);

  sleep(1);
}
