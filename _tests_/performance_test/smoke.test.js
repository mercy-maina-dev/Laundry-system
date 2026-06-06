import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '30s',
};

export default function () {
  // 1. Test POST login first to get token
  const loginPayload = JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  });

  const loginResponse = http.post('http://localhost:8088/login', loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginResponse, {
    'POST /login status is 200': (r) => r.status === 200,
    'returns token': (r) => JSON.parse(r.body).token !== undefined,
  });

  const token = loginResponse.json('token');

  sleep(1);

  // 2. Test GET admin users (requires token)
  const adminUsersResponse = http.get('http://localhost:8088/admin/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  check(adminUsersResponse, {
    'GET /admin/users status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // 3. Test GET payments
  const paymentsResponse = http.get('http://localhost:8088/payments');
  check(paymentsResponse, {
    'GET /payments status is 200': (r) => r.status === 200,
  });
}