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

let companyId = null;

export default function () {
  const createPayload = JSON.stringify({
    name: `Company-${__VU}-${__ITER}`,
    address: 'Av. Amazonia, Quito',
    ruc: `${1790000000000 + __VU * 1000 + __ITER}`,
    phone: '022345678',
    email: `test${__VU}${__ITER}@company.com`,
    availableSlots: 5,
  });

  const createParams = {
    headers: { 'Content-Type': 'application/json' },
  };

  const createRes = http.post(`${BASE_URL}/api/v1/company`, createPayload, createParams);
  check(createRes, {
    'create company status 201': (r) => r.status === 201 || r.status === 200,
    'create company has id': (r) => r.json('id') !== undefined || r.json('insertedId') !== undefined,
  }) || errorRate.add(1);
  reqDuration.add(createRes.timings.duration);

  if (createRes.status === 201 || createRes.status === 200) {
    companyId = createRes.json('id') || createRes.json('insertedId');
  }

  sleep(0.5);

  const listRes = http.get(`${BASE_URL}/api/v1/company`);
  check(listRes, {
    'list companies status 200': (r) => r.status === 200,
    'list companies is array': (r) => Array.isArray(r.json()),
  }) || errorRate.add(1);
  reqDuration.add(listRes.timings.duration);

  sleep(0.5);

  if (companyId) {
    const getRes = http.get(`${BASE_URL}/api/v1/company/${companyId}`);
    check(getRes, {
      'get company status 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    reqDuration.add(getRes.timings.duration);

    sleep(0.5);

    const updatePayload = JSON.stringify({
      availableSlots: 10,
    });

    const updateRes = http.patch(`${BASE_URL}/api/v1/company/${companyId}`, updatePayload, createParams);
    check(updateRes, {
      'update company status 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    reqDuration.add(updateRes.timings.duration);
  }

  sleep(1);
}
