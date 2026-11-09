# Changelog

Notable changes to the framework. Newest first.

## 1.3.2

- Added author links, repository metadata and a report screenshot

## 1.3.1

- Ran the account-type scenarios and looked at the two failures. Both are defects of the practice accounts, not test problems: `problem_user` (typing in Last Name fills First Name) and `error_user` (Finish does nothing)
- Tagged both `@known-defect @fail`, so the suite stays green and the defects stay documented
- Result: 34 test runs per browser, 32 pass and 2 are documented expected failures

## 1.3.0

- `UserTypes.feature`: data-driven login for every SauceDemo account type (USER-01) and a full purchase up to the order confirmation for each one (USER-02)
- Every `Examples` table now has a `case` column, and `examplesTitleFormat` uses it, so reports show "Example #3: problem user" instead of "Example #3"
- `@known-defect` tag and policy for the accounts with deliberate defects (`problem_user`, `error_user`)
- 22 scenarios in total, 34 test runs per browser, 102 across three browsers

## 1.2.1

- Removed the `Before`/`After` hooks (`steps/hooks.ts`). They weren't needed: setup stays in the Gherkin and failure evidence comes from the reports
- Verified run: 24 of 24 tests passed on Chromium

## 1.2.0

- End-to-end purchase journey (`@e2e`, E2E-01)
- Ten more scenarios: protected page and session refresh (AUTH-04, AUTH-05), more sort orders (INV-03, INV-04), cart badge count, continue shopping and removing from the product list (CART-03 to CART-05), required checkout fields, cancel checkout and order overview total (CHK-03 to CHK-05)
- 20 scenarios in total, 24 test runs per browser, 72 across three browsers

## 1.1.0

- Log in once per worker with a worker-scoped `authState` fixture (`storageState`), reused by "the user is logged in"
- `Before` and `After` hooks in `steps/hooks.ts`: browser console errors and page URL are attached to failures

## 1.0.1

- Fix: the Logout control in the side menu is a button on the current site, so the locator now uses `getByRole('button', { name: 'Logout' })`
- Move reportingLabs options into `reporting-labs.config.ts`, cache its run history in CI
- Add `.env.qa` and `.env.example`

## 1.0.0

- Playwright, TypeScript and BDD framework with page objects and custom fixtures
- Features for authentication, inventory, cart and checkout (11 test runs)
- Role-based locators and web-first assertions, with lint rules that block hard waits
- Smoke and regression suites, priority and requirement tags
- Playwright HTML and reportingLabs reports, with reportingLabs options in `reporting-labs.config.ts` and run history cached in CI
- `demo` and `qa` environment files plus an `.env.example` template
- Chromium, Firefox and WebKit projects, run as a build matrix in CI
- Pre-commit checks, pull request template, Dependabot and code owners
- Documentation: overview, strategy, architecture, traceability and coding standards
