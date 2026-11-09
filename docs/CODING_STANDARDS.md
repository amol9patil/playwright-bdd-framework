# Coding Standards

These are the rules I follow and expect in code review. ESLint, Prettier and TypeScript check most of
them (`npm run verify`). The rest is down to the reviewer.

## What I care about most

1. A new person should be able to read a feature file without opening any code.
2. A UI change should mean editing one page object. A wording change should mean editing one step.
3. Scenarios don't depend on each other. Each one can run alone, in parallel, in any order.
4. No hard waits.
5. No secrets in git, logs or reports.

## Who does what

| Layer           | Does                                          | Doesn't                            |
| --------------- | --------------------------------------------- | ---------------------------------- |
| Feature file    | Describes behaviour in business words         | Mention buttons, selectors or URLs |
| Step definition | Calls a page object, makes the assertion      | Hold locators or business rules    |
| Fixture         | Creates and hands out page objects            | Contain steps                      |
| Page object     | Owns locators and UI actions                  | Contain `expect`                   |
| Utils           | Small helpers such as reading the environment | Know about page objects            |

## Locators

Pick them in this order and stop at the first one that works:

1. `getByRole('button', { name: 'Login' })`
2. `getByLabel('Email')`
3. `getByPlaceholder('Username')`
4. `getByText('Sauce Labs Backpack', { exact: true })`. Set `exact` when names overlap.
5. `getByTestId('shopping-cart-link')`, when there's no usable role or text. The attribute name is set once in `playwright.config.ts`.
6. CSS or XPath, with a comment explaining why nothing above worked.

No `nth-child`, no long selector chains, no generated class names. To narrow a search, chain
(`card.getByRole(...)`) or use `filter({ has: ... })`.

## Page objects

- One class per page, extending `BasePage`.
- Locators are `readonly` fields assigned in the constructor.
- A field is `private` unless a step needs to assert on it.
- Method names describe what the user does: `login`, `addToCart`, `startCheckout`.
- No assertions and no scenario logic in here.

## Gherkin and steps

- Write what the user does, not how the UI works: "the user logs in with valid credentials", not "the user types into the username field".
- One behaviour per scenario. Use `Scenario Outline` when only the data changes. Start every `Examples` table with a `case` column that says in words what the row is ("wrong password", "problem user"). The report uses it as the test title.
- Keep a `Background` short. Mine is usually just the login step.
- Reuse existing steps before writing a new one. Don't add a second step that says the same thing in different words.
- Every scenario gets a suite tag (`@smoke` or `@regression`), a priority tag (`@P0` to `@P4`) and a requirement tag (`@story:ID`). Owner and feature tags go on the Feature line, so they apply to every scenario in the file.
- A scenario that hits a known product defect gets `@known-defect`. When the failure is understood it also gets `@fail` (the test is expected to fail) and a comment naming the defect. When the defect is fixed, the test starts reporting that it passes unexpectedly, which tells us to remove the tag.
- A scenario that is unstable gets `@quarantine` and a ticket reference. It doesn't run in the main suite. See `docs/TEST_STRATEGY.md`.
- Steps that only one feature uses live in that feature's file. Shared ones (like logging in) sit in `authentication.steps.ts`.

## Hooks and shared state

- Business setup goes in the Gherkin (`Background`, `Given`), so everyone can read it.
- This framework doesn't use `Before` or `After` hooks. If one is ever needed, it is for technical housekeeping only (cleanup, listeners), never for business setup.
- Reuse a login with the `authState` fixture instead of typing credentials again. Scenarios that test the
  login itself must not use it.
- Shared state lives in fixtures, never in module-level variables that tests change.

## Assertions and waiting

- Use web-first assertions: `expect(locator).toBeVisible()`, `toHaveText()`, `toHaveCount()`. They retry on their own.
- Don't assert on a value you read earlier, like `expect(await locator.textContent())`. That one doesn't retry and it's a classic source of flakiness.
- `waitForTimeout`, `networkidle` and `force: true` are blocked by lint. If you think you need one, the real problem is usually the locator or the assertion.

## Test data and secrets

- No credentials or tokens in source files, feature files, logs or screenshots.
- Environment values come from `environments/.env.<name>` or CI secrets, and only `utils/env.ts` and `playwright.config.ts` read them.
- Each scenario creates the data it needs. It never relies on something another test left behind.

## TypeScript

- Strict mode is on. No `any`.
- Put return types on class methods and exported functions.
- Use `import type` for type-only imports.

| Thing              | Style              | Example                  |
| ------------------ | ------------------ | ------------------------ |
| Page object        | PascalCase         | `InventoryPage.ts`       |
| Step file          | camelCase          | `inventory.steps.ts`     |
| Feature file       | PascalCase         | `Checkout.feature`       |
| Fields and methods | camelCase          | `cartBadge`, `addToCart` |
| Tags               | lowercase with `@` | `@smoke`, `@P1`          |

## Comments

- Write why, not what. `// click the button` above `button.click()` helps nobody.
- Page object methods get a doc comment only when something isn't obvious from the name.
- Leave a short note where a decision looks odd, for example why `exact: true` is there.
- Don't leave commented-out code behind. Git remembers it.
- If you change the code, change the comment in the same commit.

## Git and reviews

- Branches: `feature/<name>` or `fix/<name>`.
- Commit messages in the imperative: `Add checkout scenario`, `Fix cart badge locator`.
- A pull request needs one reviewer and a green `npm run verify` and test run.
- Never commit `node_modules`, `.features-gen`, reports or `test-results`.

## Done means

- The scenario reads well in plain English and has its tags.
- It reuses existing steps where it can.
- Locators follow the order above.
- No hard waits, no secrets, no dependency on another test.
- It passed three times in a row locally.
- `npm run verify` is clean.
