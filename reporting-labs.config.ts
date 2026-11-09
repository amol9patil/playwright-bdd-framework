/**
 * reportingLabs settings: title, project details, header chips and run history.
 * playwright.config.ts imports this file and passes it to the reporter.
 *
 * Edit this file when: the report title or project name changes, or you want to switch a widget off.
 * The full list of options is in the reportingLabs README (https://github.com/naveenautomationlabs/reporting-labs#options).
 */

// Records API calls (request.* and page.request) so they show up in the report.
import 'reporting-labs/auto';
import type { ReportingLabsOptions } from 'reporting-labs';

const config: ReportingLabsOptions = {
  title: 'Playwright BDD Framework - Execution Report',

  project: { name: 'SauceDemo Automation', team: 'QA Automation' },

  // Chips in the report header. env follows TEST_ENV, so a qa run is labelled qa.
  metadata: {
    env: process.env.TEST_ENV ?? 'demo',
    app: 'SauceDemo',
  },

  // Hides the password value if it ever shows up in a log or an error message.
  // Passwords and tokens are masked by default, this covers the exact value too.
  maskValues: [process.env.APP_PASSWORD ?? 'secret_sauce'],

  // Opens the report in the browser when something failed. It never opens in CI.
  open: 'on-failure',

  // Trend, "new vs known" failures and flaky detection need history from earlier runs.
  // Locally the file sits next to playwright.config.ts. In CI the workflow caches it.
  history: { enabled: true, file: 'reporting-labs.history.json', keep: 30 },
};

export default config;
