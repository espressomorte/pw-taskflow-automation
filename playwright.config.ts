import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const STORAGE_STATE_PATH = 'auth.json';
const BASE_URL = process.env.TRELLO_BASE_URL || 'https://trello.com';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 30000,
  reporter: [
    ['list'],
    ['html'],
    ['allure-playwright']
  ],
  // use: {
  //   /* Base URL to use in actions like `await page.goto('')`. */
  //   // baseURL: 'http://localhost:3000',

  //   /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
  //   trace: 'on-first-retry',
  // },
  use: {
    trace: 'on',
    storageState: 'auth.json',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: 'auth.setup.ts',
      use: {
        baseURL: BASE_URL,
      },
    },

    {
      name: 'default',
      testIgnore: 'auth.setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BASE_URL,
        storageState: STORAGE_STATE_PATH,
      },
      dependencies: ['setup'],
    },
    {
      name: 'api-only',
      testMatch: '**/create-card-api.spec.ts',
      testIgnore: 'auth.setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BASE_URL,
      },
    },
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
