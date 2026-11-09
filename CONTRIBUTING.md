# Contributing

Short guide for anyone adding or changing tests. The full rules are in
[docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md).

## Set up

```bash
nvm use                           # Node 20, from .nvmrc
npm ci
npx playwright install chromium
```

## Adding a scenario

1. **Write the scenario** in the right file under `features/`. Business language, one behaviour. Add the
   suite tag (`@smoke` or `@regression`), a priority tag (`@P0` to `@P4`) and a `@story:` ID.
2. **Generate and see what's missing:** `npx bddgen`. It lists any step that has no definition yet.
3. **Reuse before you write.** Search `steps/` for an existing step with the same meaning.
4. **Add a step** only if none fits. Keep it thin: call a page-object method, make the assertion.
5. **Reuse the saved login.** If the scenario starts logged in, use the existing `the user is logged in` step.
   Don't type the credentials again.
6. **Add to a page object** if the step needs something new on a screen. Use `getByRole`, `getByLabel`,
   `getByPlaceholder` or `getByText` first. Use `getByTestId` only when nothing else works.
7. **Run it:** `npm test`. Run it three times. If it isn't green all three, it isn't ready.
8. **Check it:** `npm run verify`.

## Branches, commits and pull requests

- Branch from `main`: `feature/<name>` or `fix/<name>`.
- Commit messages in the imperative: `Add checkout validation scenario`.
- The pre-commit hook lints and formats staged files. Don't skip it with `--no-verify`.
- Open a pull request and fill in the template. One review is needed, and the pipeline must be green.

## If a test is flaky

Don't add a wait. Find the cause (usually a weak locator or an assertion that doesn't retry). If you can't fix
it in the same pull request, tag the scenario `@quarantine`, add a ticket reference in a comment, and
tell the team.
