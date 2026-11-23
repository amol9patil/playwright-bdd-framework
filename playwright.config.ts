/**
 * Runner configuration. This is where I control how the suite behaves: which environment it
 * points at, how many tests run in parallel, which browsers are used and what evidence we keep.
 *
 * Edit this file when: you add a browser, change timeouts or add a reporter.
 * Don't put application logic or credentials in here.
 */

import path from 'path';
import dotenv from 'dotenv';
import 'reporting-labs/auto';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import type { ReportingLabsOptions } from 'reporting-labs';

// Picks environments/.env.<TEST_ENV>. Default is demo, e.g. TEST_ENV=qa npm test
dotenv.config({
  path: path.resolve(__dirname, `environments/.env.${process.env.TEST_ENV ?? 'demo'}`),
  quiet: true,
});

// bddgen turns the .feature files into specs; this returns the folder they are written to.
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  examplesTitleFormat: 'Example #<_index_>: <case>',
  steps: ['steps/**/*.ts', 'fixtures/**/*.ts'],
});

// reportingLabs settings: title, project details, header chips, masking and run history.
const reportingLabs: ReportingLabsOptions = {
  title: 'Playwright BDD Framework - Execution Report',
  project: { name: 'SauceDemo Automation', team: 'QA Automation' },
  metadata: {
    env: process.env.TEST_ENV ?? 'demo',
    app: 'SauceDemo',
  },
  maskValues: [process.env.APP_PASSWORD ?? 'secret_sauce'],
  open: 'on-failure',
  // Trend, "new vs known" failures and flaky detection need history from earlier runs.
  history: { enabled: true, file: 'reporting-labs.history.json', keep: 30 },
};

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
    ['html', { open: 'never' }],
    // Options live in reporting-labs.config.ts. The report is written to reporting-labs/index.html.
    ['reporting-labs', reportingLabs],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
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
