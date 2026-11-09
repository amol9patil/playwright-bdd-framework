# Framework Overview (for non-technical readers)

This page is for product owners, business analysts, project managers and clients. You don't need to
read any code. If you can read a short English sentence, you can follow what the framework checks.

## What this is, in plain words

A set of automated checks that behave like a careful user. They open the application in a real
browser, log in, add products to a cart, check out, and confirm that everything works the way the
business expects. A person would take hours to repeat that for every release. The framework does it
in a few minutes, the same way every time, and it keeps proof when something breaks.

## Why it matters to the business

| What you care about    | What the framework gives you                                                        |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Release confidence     | A clear pass or fail on the important user journeys before every release            |
| Speed                  | The regression check runs in minutes instead of days of manual testing              |
| Cost of defects        | Problems are found when a change is made, when they're cheap to fix                 |
| Visibility             | A report anyone can open, with priorities, owners and trends                        |
| Audit and traceability | Every check links back to a requirement ID (see [TRACEABILITY.md](TRACEABILITY.md)) |

## What it checks today

The demo application is SauceDemo, a public practice shop. Each area below is one feature file you can
open and read.

| Area           | What a customer can do                           | Checks |
| -------------- | ------------------------------------------------ | ------ |
| Authentication | Log in, see an error for a wrong login, log out  | 5      |
| Inventory      | See the product list, sort it by price           | 2      |
| Cart           | Add a product, remove a product                  | 2      |
| Checkout       | Complete an order, get asked for missing details | 2      |

That is 34 checks. Each one runs on three browsers (Chrome, Firefox and Safari engines) in the build
pipeline, which gives 102 results per run.

## How a check is written

Checks are written as short stories in plain English, using Given, When and Then:

```gherkin
Scenario: Add a product to the cart
  Given the user is logged in
  When the user adds "Sauce Labs Backpack" to the cart
  Then the cart badge shows 1
```

Given is the starting point, When is what the user does, Then is what must be true afterwards. Business
analysts and testers can review and approve these before any automation is built. The same text is what
the framework runs, so the documentation never drifts away from what is really tested.

## What happens in a run

1. Someone changes the application, or the schedule triggers the nightly run.
2. The pipeline starts the framework, which opens the browsers and runs each check.
3. It records the result, and for any failure it keeps a screenshot, a video and a step-by-step trace.
4. Two reports are produced. The pipeline stores them and anyone with access can download them.

## Reading the report

I produce two reports because they serve different people.

- **reportingLabs report** (`reporting-labs/index.html`) is the one for managers and leads. It shows the
  pass rate, which failures matter most (P0 is most critical), who owns each one, whether a failure is
  new or has been there a while, which tests are flaky, and how the trend moves across runs.
- **Playwright report** (`playwright-report/index.html`) is for engineers who need to see exactly what
  happened in a failed check.

What the colours mean: green is passed, red is failed, and a "flaky" label means the check failed and then
passed on a retry, so it needs attention even though the run looks green.

## Who does what

| Role               | Responsibility                                                                   |
| ------------------ | -------------------------------------------------------------------------------- |
| Product owner / BA | Review the feature files. Confirm they describe the behaviour the business wants |
| QA engineer        | Write and maintain scenarios, step definitions and page objects                  |
| Test architect     | Own the framework design, standards and pipeline (that's me, Amol)               |
| Developer          | Fix failures that point to a real defect. Tell QA when the UI is going to change |
| Project manager    | Use the report and trend to judge release readiness                              |

## Frequently asked questions

**Does this replace manual testing?** No. It handles the repetitive regression checks so manual testers
can spend their time on exploratory testing and new features.

**What if the application changes?** The framework is built so a screen change means editing one file,
the page object for that screen. Business wording changes mean editing one step.

**What does "flaky" mean?** A check that sometimes passes and sometimes fails without any real change
to the application. I track these separately and park them under a quarantine tag until fixed, so they
don't hide real failures.

**Why do two checks count as "expected failures"?** They run against practice accounts that have defects on
purpose: one account can't type a last name properly, another can't finish an order. I keep those checks and
mark them as expected to fail. The suite stays green, the defect stays visible, and if the application is
ever fixed the check tells us.

**Can we run only the important checks?** Yes. `@smoke` is the quick set of critical journeys.
`@regression` is the full set.

## Glossary

| Term             | Meaning                                                                      |
| ---------------- | ---------------------------------------------------------------------------- |
| BDD              | Behaviour-driven development: describing tests as readable behaviour stories |
| Gherkin          | The Given/When/Then format the stories are written in                        |
| Scenario         | One check, one behaviour                                                     |
| Feature          | A group of related scenarios, for example Cart                               |
| Page object      | A code file that knows how to use one screen of the application              |
| Step definition  | The small piece of code behind each Given, When or Then line                 |
| Smoke suite      | A short set of checks that confirms the critical journeys still work         |
| Regression suite | The full set of checks that confirms nothing has broken                      |
| Flaky test       | A test that gives different results without any change to the application    |
| CI/CD pipeline   | The automated process that builds and tests the application on every change  |
| P0 to P4         | Priority of a check or failure. P0 is business critical, P4 is low           |
