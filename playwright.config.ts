/**
 * Runner configuration. This is where I control how the suite behaves: which environment it
 * points at, how many tests run in parallel, which browsers are used and what evidence we keep.
 *
 * Edit this file when: you add a browser, change timeouts or add a reporter.
 * Don't put application logic or credentials in here.
 */

import path from 'path';
import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import reportingLabs from './reporting-labs.config';

// Picks environments/.env.<TEST_ENV>. Default is demo, e.g. TEST_ENV=qa npm test
dotenv.config({
  path: path.resolve(__dirname, `environments/.env.${process.env.TEST_ENV ?? 'demo'}`),
  quiet: true,
});

// bddgen turns the .feature files into specs; this returns the folder they are written to.
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  // Names each example row in the report, using the `case` column of every Examples table.
  examplesTitleFormat: 'Example #<_index_>: <case>',
  // fixtures/ is listed too so playwright-bdd can find the extended `test` object.
  steps: ['steps/**/*.ts', 'fixtures/**/*.ts'],
});

export default defineConfig({
  testDir,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  // Scenarios don't share state, so they can run in parallel and in any order.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,

  // Scenarios tagged @quarantine are known-unstable and parked until fixed.
  // They don't block the pipeline. See docs/TEST_STRATEGY.md for the policy.
  grepInvert: /@quarantine/,

  reporter: [
    ['list'],
    // For debugging a failure: steps, screenshots, video, traces.
    ['html', { open: 'never' }],
    // For triage and status: priority, new vs known failures, flaky history, trend.
    // Options live in reporting-labs.config.ts. The report is written to reporting-labs/index.html.
    ['reporting-labs', reportingLabs],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    // SauceDemo uses data-test, not the default data-testid.
    testIdAttribute: 'data-test',
    headless: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    // Only keep evidence for failures.
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  // Local runs use chromium only (fast). CI runs all three through a build matrix.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
