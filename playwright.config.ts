import { defineConfig } from '@playwright/test';

const fixtures = process.env.PORTAL_TEST_FIXTURES === '1';
export default defineConfig({
  testDir: './tests',
  testMatch: fixtures ? '**/carousel-fixtures.spec.ts' : '**/home.spec.ts',
  workers: 1,
  timeout: 40000,
  expect: { timeout: 8000 },
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${fixtures ? 3101 : 3100}`,
    browserName: 'chromium',
    channel: 'msedge',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: fixtures ? 'npm run dev -- --port 3101' : 'npm start -- --port 3100',
    url: `http://localhost:${fixtures ? 3101 : 3100}`,
    reuseExistingServer: false,
    timeout: 60000,
  },
});
