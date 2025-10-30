import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users over 2 minutes
    { duration: '5m', target: 100 }, // Stay at 100 users for 5 minutes
    { duration: '2m', target: 200 }, // Ramp up to 200 users over 2 minutes
    { duration: '5m', target: 200 }, // Stay at 200 users for 5 minutes
    { duration: '2m', target: 0 },   // Ramp down to 0 users over 2 minutes
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests should be below 1.5s
    http_req_failed: ['rate<0.1'],     // Error rate should be below 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  // Simulate page view
  let response = http.post(`${BASE_URL}/api/track`, {
    eventType: 'pageview',
    pageUrl: '/',
    pageTitle: 'Home Page',
    visitorHash: `visitor_${Math.random().toString(36).substr(2, 9)}`,
    consentGiven: true,
  });

  check(response, {
    'pageview status is 200': (r) => r.status === 200,
    'pageview response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(Math.random() * 2 + 1); // Random sleep between 1-3 seconds

  // Simulate click event
  response = http.post(`${BASE_URL}/api/track`, {
    eventType: 'click',
    pageUrl: '/',
    pageTitle: 'Home Page',
    element: 'button',
    visitorHash: `visitor_${Math.random().toString(36).substr(2, 9)}`,
    consentGiven: true,
  });

  check(response, {
    'click status is 200': (r) => r.status === 200,
    'click response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(Math.random() * 3 + 2); // Random sleep between 2-5 seconds

  // Simulate dashboard access (authenticated users only)
  if (Math.random() < 0.1) { // 10% of users access dashboard
    response = http.get(`${BASE_URL}/api/events?startDate=${new Date(Date.now() - 86400000).toISOString()}&endDate=${new Date().toISOString()}`);

    check(response, {
      'dashboard status is 401 or 200': (r) => r.status === 401 || r.status === 200,
      'dashboard response time < 2000ms': (r) => r.timings.duration < 2000,
    });
  }

  sleep(Math.random() * 5 + 3); // Random sleep between 3-8 seconds
}