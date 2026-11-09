# Test Strategy

How I decide what to automate, how the suites are organised, and how failures are handled.
This is the short version I'd agree with a delivery team at the start of a project.

## 1. Objective

Give the team fast and trustworthy feedback on the business-critical user journeys, so that releases
don't depend on days of manual regression.

## 2. Scope

| In scope                                                                        | Out of scope (for now)       |
| ------------------------------------------------------------------------------- | ---------------------------- |
| UI journeys: login, browsing, cart, checkout, plus one end-to-end purchase flow | Performance and load testing |
| Positive and key negative paths                                                 | Deep security testing        |
| Three browser engines in CI                                                     | Mobile native apps           |
| Smoke and regression suites                                                     | Visual pixel comparison      |

API checks and accessibility checks are on the roadmap. UI automation sits at the top of the test
pyramid, so it should stay focused on journeys. Anything that can be checked faster at unit or API level
should be.

## 3. Risk-based prioritisation

Every scenario carries a priority tag. I decide it by asking what happens to the business if this breaks.

| Tag           | Meaning                                         | Example here                           |
| ------------- | ----------------------------------------------- | -------------------------------------- |
| `@P0`         | Business critical. Revenue or access is blocked | Login, add to cart, complete an order  |
| `@P1`         | Major feature broken, workaround exists         | Invalid login errors, remove from cart |
| `@P2`         | Minor feature or convenience                    | Sorting, logout                        |
| `@P3` / `@P4` | Cosmetic or rare cases                          | Color or Text changes                  |

## 4. Suites

| Suite        | Tag             | Runs                           | Purpose                                                                                                                                                                                                  |
| ------------ | --------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Smoke        | `@smoke`        | On every pull request and push | Confirms the critical journeys work. Should stay under a few minutes                                                                                                                                     |
| Regression   | `@regression`   | Nightly, and before a release  | Wider coverage including negative paths                                                                                                                                                                  |
| End-to-end   | `@e2e`          | Nightly, and before a release  | One long journey (login to logout) that proves the screens work together. Kept to a minimum because long journeys are slower and break more easily                                                       |
| Known defect | `@known-defect` | With the regression suite      | Scenarios for accounts or areas with deliberate or reported defects. A failure is classified first. Once understood it gets `@fail` and a note, so the suite stays green and the defect stays documented |
| Quarantine   | `@quarantine`   | Never in the main run          | Known-unstable tests parked until fixed                                                                                                                                                                  |

## 5. Environments and data

- Environment settings come from `environments/.env.<name>`. `TEST_ENV` picks the file.
- Each scenario creates what it needs and doesn't depend on another scenario, so runs are repeatable.
- Real credentials are never committed. They come from a git-ignored local file or from pipeline secrets.

## 6. Execution

- Local: chromium only, for speed.
- CI: chromium, firefox and webkit run as a build matrix, on every push and pull request, plus a weekday
  nightly run and a manual trigger that accepts a tag filter.
- Parallel workers locally, fewer in CI. One retry in CI to separate flaky tests from genuine failures.

## 7. Entry and exit criteria

**Entry:** the build deploys to the test environment, the smoke suite can reach the login page, and test
data and credentials are in place.

**Exit (release candidate):**

- All `@P0` scenarios pass on all three browsers.
- No open failure that points to a real defect in a `@P0` or `@P1` area.
- Any flaky test has an owner and a ticket.

## 8. Failure triage

1. Open the reportingLabs report. Check whether the failure is new or already known.
2. Open the failure's detail: error summary, screenshot, video and trace.
3. Decide which of three causes it is:
   - **Product defect:** raise a bug with the evidence attached. The report can generate the ticket text.
   - **Test problem:** a locator, data or timing issue. Fix it in the page object or the step.
   - **Environment problem:** the system under test was unavailable. Re-run and note it.
4. Don't re-run again and again hoping it passes. A retry that passes is recorded as flaky and counted.

## 9. Flaky test policy

A test that passes on retry is a defect in the suite. I don't ignore it.

1. The report flags it as flaky.
2. The owner investigates within the sprint. Common causes: a weak locator, an assertion that doesn't
   retry, shared test data.
3. If it can't be fixed quickly, tag it `@quarantine` with a ticket reference, so it stops blocking the
   pipeline but stays visible.
4. Fixing or deleting a quarantined test is part of the definition of done for the sprint.

## 10. Metrics I track

These are proposed targets to agree with the stakeholders.

| Metric                       | Target           |
| ---------------------------- | ---------------- |
| Smoke suite duration         | Under 5 minutes  |
| Full regression duration     | Under 15 minutes |
| Flaky rate                   | Under 2%         |
| `@P0` journeys automated     | 100%             |
| Time to triage a new failure | Same day         |

## 11. Maintenance

Page objects absorb UI changes. Dependencies are updated through Dependabot. Standards are enforced by
lint and format checks locally (pre-commit) and in the pipeline. See
[CODING_STANDARDS.md](CODING_STANDARDS.md) and [../CONTRIBUTING.md](../CONTRIBUTING.md).

## 12. Known defects

SauceDemo's practice accounts come with built-in defects. I don't delete those tests and I don't leave
them red. Each one is tagged `@fail`, so Playwright treats the failure as expected, the pipeline stays
green, and I get told if the behaviour ever changes.

| Account        | What goes wrong                                                                                        | Scenario |
| -------------- | ------------------------------------------------------------------------------------------------------ | -------- |
| `problem_user` | Typing in the Last Name field fills First Name instead, so checkout stops with "Last Name is required" | USER-02  |
| `error_user`   | Clicking Finish does nothing, so the order is never confirmed                                          | USER-02  |

On a client project the comment next to `@fail` also carries the defect ticket number. When the defect is
fixed, the test shows up as an unexpected pass, and that is my cue to remove the tag.
